import { connect, Empty, StringCodec } from "nats";

const QUEUE_ADDR = process.env.QUEUE_ADDR;
const TOPIC = "job";

async function connect() {
  return await connect({ servers: QUEUE_ADDR });
}
const queue = await connect();

const sc = StringCodec();

const publish = (msg) => {
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
