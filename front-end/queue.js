import { connect, StringCodec } from "nats";

const QUEUE_ADDR = process.env.QUEUE_ADDR;
const TOPIC = "job";

async function asyncConnect() {
  return await connect({ servers: QUEUE_ADDR });
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
