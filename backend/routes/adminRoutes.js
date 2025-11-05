import express from "express";
import { syncFromSusa } from "../services/importSusaService.js";

const router = express.Router();

router.get("/susa-sync", async (req, res) => {
  try {
    console.log("Starting full SUSA sync...");
    await syncFromSusa();
    console.log("✅ All data synced successfully.");
    res.json({ message: "✅ All data synced successfully." });
  } catch (err) {
    console.error("❌ Sync error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;