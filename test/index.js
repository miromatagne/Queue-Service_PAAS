import axios from "axios"

const service = axios.create({
    baseURL: 'https://smpaas.vera.kumori.cloud' || 'http://localhost:8080',
    timeout: 15000,
    headers: {'Content-Type': 'application/json'}
});

//(() => {let res = 0; for(let i = 0; i < 2000000000; i++) {res+=i} return res})()

const ECHO_REQUEST   = {type: 'echo', content: 'echo'};
const ARITHM_REQUEST = {type: 'arithm', content: '11*23'};

async function sendRequest(req, times, verbose = 0)
{
    let start = new Date();
    let promises = [];
    for(let i = 0; i < times; i++)
    {
        promises.push(service.post('/', req));
    }
    await Promise.all(promises)
        .then(values => {
            if (verbose > 0)
            {
                console.log(`Answers: ${values.length}`);
                values.forEach(value => {
                    if (verbose > 1) console.log(value.data ? value.data : 'timeout');
                })
            }}
        )
        .catch(err => { if (verbose) console.log(err.message) });
    let time = new Date() - start;
    console.log(`Time: ${time / 1000} seconds`);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main()
{
    const REQUESTS = 100;

    while (true)
    {
        // Send echo requests
        console.log(`Sending ${REQUESTS} echo requests...`);
        await sendRequest(ECHO_REQUEST, REQUESTS, 1);

        // Send arithmetic requests
        console.log(`Sending ${REQUESTS} arithmetic requests...`);
        await sendRequest(ARITHM_REQUEST, REQUESTS, 1);
    }
}

main();