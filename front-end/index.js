import express from "express";
import queue from "./queue.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.post("/", async (req, res) => {
  const message = req.body.message;
  console.log(`Receiving message: ${message}`);
  const result = await queue.publish(message);
  console.log(`Result received: ${result}`);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Front end listening on port ${PORT}`);
});
