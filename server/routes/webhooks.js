import express from "express";
import { inngest } from "../inngest/index.js";

const webhookRouter = express.Router();

webhookRouter.post("/clerk", async (req, res) => {

    try {

        const event = req.body;

        console.log("Webhook received:", event.type);

        await inngest.send({
            name: event.type,
            data: event.data,
        });

        console.log("Event sent to Inngest");

        res.status(200).send("Webhook received");

    } catch (error) {

        console.log(error);

        res.status(500).send("Error");

    }
});

export default webhookRouter;