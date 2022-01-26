import express from "express";
import queue from "./queue.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.post("/", async (req, res) => {
  const body = req.body;
  console.log(
    `Receiving message of type ${body.type} and content ${body.content}`
  );
  const result = await queue.publish(JSON.stringify(body));
  console.log(`Result received: ${result}`);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Front end listening on port ${PORT}`);
});
