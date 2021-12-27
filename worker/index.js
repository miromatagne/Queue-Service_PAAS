import { connect, StringCodec } from "nats";

const QUEUE_ADDR = process.env.QUEUE_ADDR | "localhost";
const TOPIC = "job";

async function asyncConnect() {
  try {
    const queue = await connect({ servers: QUEUE_ADDR });
    console.log("Connected to queue");
    process.on("exit", () => { queue.close(); });
    return queue;
  } catch (err) {
    console.log(`Error connecting to ${QUEUE_ADDR}`);
  }
}

const queue = await asyncConnect();
const sc = StringCodec();

const sub = queue.subscribe(TOPIC);
(async (inSub) => {
  for await (const m of inSub) {
    console.log(`Received a task: ${sc.decode(m.data)}`);
    m.respond(m.data);
  }
})(sub);
