import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
