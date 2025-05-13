import { Webhook } from "svix";
import User from "../Models/user.js";

// Api controller function to manage Clerk user webhooks
export const clerkWebhooks = async (req, resp) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
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
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        return resp.json({});
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        return resp.json({});
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return resp.json({});
      }

      default:
        return resp.status(400).json({ success: false, message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    return resp.status(500).json({ success: false, message: error.message });
  }
};
