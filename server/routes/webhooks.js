import express from "express";
import { inngest } from "../inngest/index.js";

const webhookRouter = express.Router();

webhookRouter.post("/clerk", async (req, res) => {
  try {
    const event = req.body;

    // 🔥 STEP 1: RAW RECEIVED DATA
    console.log("🔥 RAW WEBHOOK RECEIVED:");
    console.log(JSON.stringify(event, null, 2));

    // 🔥 STEP 2: CHECK EVENT TYPE
    console.log("🎯 EVENT TYPE:", event.type);

    if (!event.type) {
      console.log("❌ No event type received");
      return res.status(400).send("Invalid event");
    }

    // 🔥 STEP 3: BEFORE SENDING TO INNGEST
    console.log("🚀 Sending to Inngest...");

    await inngest.send({
      name: event.type,
      data: event.data,
    });

    // 🔥 STEP 4: AFTER SUCCESS
    console.log("✅ Sent to Inngest successfully");

    res.status(200).send("Webhook received");
  } catch (error) {
    console.log("❌ WEBHOOK ERROR:", error);
    res.status(500).send("Error");
  }
});

export default webhookRouter;