import express from "express";
import queue from "./queue.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

//When a POST request is received, a publish is made to the queue
app.post("/", async (req, res) => {
  //JSON body attached to the request
  const body = req.body;
  console.log(
    `Receiving message of type ${body.type} and content ${body.content}`
  );
  //Publish the stringified version of the JSON to the queue
  const result = await queue.publish(JSON.stringify(body));
  console.log(`Result received: ${result}`);
  //Return the result to the client
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Front end listening on port ${PORT}`);
});
