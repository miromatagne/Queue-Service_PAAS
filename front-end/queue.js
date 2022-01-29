import { connect, StringCodec } from "nats";

const QUEUE_ADDR = process.argv.slice(2) || ["localhost"];
const QUEUE_PORT = 4222;
const TOPIC = "job";

async function asyncConnect() {
  try {
    const queue = await connect({ servers: QUEUE_ADDR.map(addr => `${addr}:${QUEUE_PORT}`) });
    console.log(`Connected to queue: ${queue.getServer()}`);
    process.on("exit", () => {
      queue.close();
    });
    return queue;
  } catch (err) {
    console.log(`Error connecting to ${QUEUE_ADDR}`);
    return null;
  }
}

const queue = await asyncConnect();
const sc = StringCodec();

if (queue == null) process.exit(1);

const publish = async (msg) => {
  return await queue
    .request(TOPIC, sc.encode(msg), { timeout: 10000 })
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
