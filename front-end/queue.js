import { connect, StringCodec } from "nats";

//The address of the queue comes fron the arguments given to NodeJS from the init.sh script
//In case there are no arguments, localhost is used for local testing
const QUEUE_ADDR = process.argv.slice(2) || ["localhost"];
const QUEUE_PORT = 4222;
//Topic to which the Front-End requests a response
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
 * Requests a response from the Queue, sending stringified JSON message
 * @param {String} msg : message to be sent to the queue
 * @returns the response from the queue, or null in case of an error
 */
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
