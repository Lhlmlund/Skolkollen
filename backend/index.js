import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
import schoolRouter from './routes/schoolRoutes.js'

app.use(express.json())
app.use('/',schoolRouter)


app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
