import { Router } from "express";
import Portfolio from "../models/Portfolio";
import { isConnected } from "../lib/mongo";

const router = Router();

router.get("/portfolio", async (req, res) => {
  if (!isConnected()) {
    res.status(503).json({ error: "Database not connected" });
    return;
  }
  try {
    const doc = await Portfolio.findOne().lean();
    if (!doc) {
      res.status(404).json({ error: "No portfolio data found" });
      return;
    }
    res.json(doc);
  } catch (err) {
    req.log.error({ err }, "Failed to get portfolio");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/portfolio", async (req, res) => {
  if (!isConnected()) {
    res.status(503).json({ error: "Database not connected" });
    return;
  }
  try {
    const body = req.body as Record<string, unknown>;
    const doc = await Portfolio.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, lean: true }
    );
    res.json(doc);
  } catch (err) {
    req.log.error({ err }, "Failed to update portfolio");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
