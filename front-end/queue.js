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

const publish = async (msg) => {
  return await queue
    .request(TOPIC, sc.encode(msg), { timeout: 2000 })
    .then((m) => {
      return sc.decode(m.data);
    })
    .catch(() => {
      return null;
    });
};

export default {
  publish,
};
