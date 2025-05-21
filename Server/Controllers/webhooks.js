import { Webhook } from "svix";
import User from "../Models/user.js";
import Stripe from "stripe";
import Purchase from "../Models/purchase.js";
import Course from "../Models/course.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Clerk webhook handler
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify webhook signature
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };
        await User.create(userData);
        return res.json({ success: true });
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };
        await User.findByIdAndUpdate(data.id, userData);
        return res.json({ success: true });
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.json({ success: true });
        break;
      }
      default:
        return res
          .status(400)
          .json({ success: false, message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Clerk Webhook error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Stripe webhook handler
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body, // raw body required
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const purchaseId = session.metadata.purchaseId;

      const purchaseData = await Purchase.findById(purchaseId);
      if (!purchaseData) break;

      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId);

      if (!userData || !courseData) break;

      // Avoid duplicates
      if (!courseData.enrolledStudents.includes(userData._id)) {
        courseData.enrolledStudents.push(userData._id);
        await courseData.save();
      }

      if (!userData.enrolledCourses.includes(courseData._id)) {
        userData.enrolledCourses.push(courseData._id);
        await userData.save();
      }

      purchaseData.status = "completed";
      await purchaseData.save();
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });

      const session = sessionList.data[0];
      const purchaseId = session?.metadata?.purchaseId;
      if (!purchaseId) break;

      const purchaseData = await Purchase.findById(purchaseId);
      if (purchaseData) {
        purchaseData.status = "failed";
        await purchaseData.save();
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
