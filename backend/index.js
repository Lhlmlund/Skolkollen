import express from "express";
import {connectDB} from "./dbConnection.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json)
app.use(express.urlencoded( {extended:false}))

connectDB()


app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
