import axios from "axios";

/**
 * Create an axios Service to make HTTP requests
 */
const service = axios.create({
  baseURL: "https://smpaas.vera.kumori.cloud" || "http://localhost:8080",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

//The 2 requetsts that will be used for testing
const ECHO_REQUEST = { type: "echo", content: "echo" };
const ARITHM_REQUEST = { type: "arithm", content: "11*23" };

/**
 * Sends various requests to the FaaS to test if it works as desired
 * @param {Object} req : JSON specifying the request to make
 * @param {Number} times : number of times the request should be made
 * @param {Number} verbose : 1 uf the user wants logs, 0 otherwise
 */
async function sendRequest(req, times, verbose = 0) {
  let start = new Date();
  let promises = [];
  for (let i = 0; i < times; i++) {
    promises.push(service.post("/", req));
  }
  await Promise.all(promises)
    .then((values) => {
      if (verbose > 0) {
        console.log(`Answers: ${values.length}`);
        values.forEach((value) => {
          if (verbose > 1) console.log(value.data ? value.data : "timeout");
        });
      }
    })
    .catch((err) => {
      if (verbose) console.log(err.message);
    });
  let time = new Date() - start;
  console.log(`Time: ${time / 1000} seconds`);
}

/**
 * Main function to execute
 */
async function main() {
  const REQUESTS = 100;

  while (true) {
    // Send echo requests
    console.log(`Sending ${REQUESTS} echo requests...`);
    await sendRequest(ECHO_REQUEST, REQUESTS, 1);

    // Send arithmetic requests
    console.log(`Sending ${REQUESTS} arithmetic requests...`);
    await sendRequest(ARITHM_REQUEST, REQUESTS, 1);
  }
}

main();
