import { Router } from "express";
import Message from "../models/Message";
import { isConnected } from "../lib/mongo";

const router = Router();

router.get("/messages", async (req, res) => {
  if (!isConnected()) {
    res.status(503).json({ error: "Database not connected" });
    return;
  }
  try {
    const msgs = await Message.find().sort({ timestamp: -1 }).lean();
    res.json(msgs);
  } catch (err) {
    req.log.error({ err }, "Failed to get messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/messages", async (req, res) => {
  if (!isConnected()) {
    res.status(503).json({ error: "Database not connected" });
    return;
  }
  try {
    const { name, email, message } = req.body as { name: string; email: string; message: string };
    if (!name || !email || !message) {
      res.status(400).json({ error: "name, email and message are required" });
      return;
    }
    const doc = await Message.create({ name, email, message, timestamp: Date.now(), read: false });
    res.status(201).json(doc);
  } catch (err) {
    req.log.error({ err }, "Failed to create message");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/messages/:id/read", async (req, res) => {
  if (!isConnected()) {
    res.status(503).json({ error: "Database not connected" });
    return;
  }
  try {
    const doc = await Message.findByIdAndUpdate(
      req.params["id"],
      { $set: { read: true } },
      { new: true, lean: true }
    );
    if (!doc) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(doc);
  } catch (err) {
    req.log.error({ err }, "Failed to mark message read");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/messages/:id", async (req, res) => {
  if (!isConnected()) {
    res.status(503).json({ error: "Database not connected" });
    return;
  }
  try {
    await Message.findByIdAndDelete(req.params["id"]);
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete message");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
