import { connect, StringCodec } from "nats";

//The address of the queue comes fron the arguments given to NodeJS from the init.sh script
//In case there are no arguments, localhost is used for local testing
const QUEUE_ADDR = process.argv.slice(2) || ["localhost"];
const QUEUE_PORT = 4222;
//Topic to which the Worker susbscribes
const TOPIC = "job";

/**
 * Function that connects the Front-End component with the Queue
 * @returns the queue, or null in case of an error
 */
async function asyncConnect() {
  try {
    const queue = await connect({
      servers: QUEUE_ADDR.map((addr) => `${addr}:${QUEUE_PORT}`),
    });
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

/**
 * Subscribes to the queue, with the indicated topic.
 * Whenever a message arrives, it is handled depending on the desired function to execute.
 */
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

/**
 * Performs an echo function
 * @param {String} msg : message to which the echo is applied
 * @returns the result of the echo
 */
function echo(msg) {
  return msg;
}

/**
 * Performs an arithmetic operation and returns the result
 * @param {String} msg : arithmetic operation to evaluate
 * @returns the result of the arithmetic operation
 */
function arithm(msg) {
  var res = "";
  try {
    res = eval(msg);
  } catch (e) {
    res = "Invalid arithmetic operation";
  }
  return res;
}
