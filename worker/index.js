import { connect, StringCodec } from "nats";

const QUEUE_ADDR = process.argv.slice(2) || ["localhost"];
const QUEUE_PORT = 4222;
const TOPIC = "job";

async function asyncConnect() {
  try {
    const queue = await connect({ servers: QUEUE_ADDR.map(addr => `${addr}:${QUEUE_PORT}`)});
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

const sub = queue.subscribe(TOPIC, { queue: "tasks" });
(async (inSub) => {
  for await (const m of inSub) {
    const body = JSON.parse(sc.decode(m.data));
    console.log(
      `Received a task of type ${body.type} and content ${body.content}`
    );
    var res = "";
    switch (body.type) {
      case "echo":
        res = echo(body.content);
        break;
      case "arithm":
        res = arithm(body.content);
        break;
      default:
        res = "Unknown function";
    }
    m.respond(sc.encode(res));
  }
})(sub);

function echo(msg) {
  return msg;
}

function arithm(msg) {
  var res = "";
  try {
    res = eval(msg);
  } catch (e) {
    res = "Invalid arithmetic operation";
  }
  return res;
}
