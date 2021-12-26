const { connect, StringCodec } = require("nats");

const QUEUE_ADDR = process.env.QUEUE_ADDR;
const TOPIC = "job";

async function connect() {
  return await connect({ servers: QUEUE_ADDR });
}

const queue = await connect();

const sc = StringCodec();

const sub = nc.subscribe(TOPIC);
(async () => {
  for await (const m of sub) {
    m.respond(m.data);
  }
})(sub);
