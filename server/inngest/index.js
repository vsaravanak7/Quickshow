import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

/* ---------------- CREATE USER ---------------- */
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: [{ event: "user.created" }] },
  async ({ event }) => {
    try {
      console.log("Full event data:", JSON.stringify(event.data, null, 2));

      const {
        id,
        first_name,
        last_name,
        email_addresses,
        image_url,
        primary_email_address_id,
      } = event.data;

      // SAFE EMAIL EXTRACTION (IMPORTANT FIX)
      const email =
        email_addresses?.find(
          (e) => e.id === primary_email_address_id
        )?.email_address ||
        email_addresses?.[0]?.email_address ||
        "no-email";

      await User.create({
        _id: id,
        email,
        name: `${first_name || ""} ${last_name || ""}`,
        image: image_url,
      });

      console.log("User created successfully");
    } catch (error) {
      console.error("CREATE USER ERROR:", error);
    }
  }
);

/* ---------------- UPDATE USER ---------------- */
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk", triggers: [{ event: "user.updated" }] },
  async ({ event }) => {
    try {
      const {
        id,
        first_name,
        last_name,
        email_addresses,
        primary_email_address_id,
        image_url,
      } = event.data;

      const email =
        email_addresses?.find(
          (e) => e.id === primary_email_address_id
        )?.email_address ||
        email_addresses?.[0]?.email_address ||
        "no-email";

      await User.findByIdAndUpdate(
        id,
        {
          email,
          name: `${first_name || ""} ${last_name || ""}`,
          image: image_url,
        },
        { new: true }
      );

      console.log("User updated successfully");
    } catch (error) {
      console.error("UPDATE USER ERROR:", error);
    }
  }
);

/* ---------------- DELETE USER ---------------- */
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk", triggers: [{ event: "user.deleted" }] },
  async ({ event }) => {
    try {
      const { id } = event.data;

      await User.findByIdAndDelete(id);

      console.log("User deleted successfully");
    } catch (error) {
      console.error("DELETE USER ERROR:", error);
    }
  }
);

/* ---------------- EXPORT ---------------- */
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];