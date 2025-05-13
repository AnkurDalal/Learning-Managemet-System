import { Webhook } from "svix";
import User from "../Models/user.js";

//Api controller function to manage clerk user with database
export const clerkWebhooks = async (req, resp) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["signature"],
    });
    const { data, type } = req.body;
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_Url,
        };
        await User.create(userData);
        resp.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_Url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        resp.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        resp.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    resp.json({ success: false, message: error.message });
  }
};
