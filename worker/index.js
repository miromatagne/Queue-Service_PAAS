import { connect, StringCodec } from "nats";

const QUEUE_ADDR = process.env.QUEUE_ADDR;
const TOPIC = "job";

async function asyncConnect() {
  return await connect({ servers: QUEUE_ADDR });
}

const queue = await asyncConnect();

const sc = StringCodec();

const sub = nc.subscribe(TOPIC);
(async (inSub) => {
  for await (const m of inSub) {
    m.respond(sc.decode(m.data));
  }
})(sub);
