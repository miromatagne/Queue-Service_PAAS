import axios from "axios"

const service = axios.create({
    baseURL: 'https://smpaas.vera.kumori.cloud' || 'http://localhost:8080',
    timeout: 15000,
    headers: {'Content-Type': 'application/json'}
});

//(() => {let res = 0; for(let i = 0; i < 2000000000; i++) {res+=i} return res})()

const ECHO_REQUEST   = {type: 'echo', content: 'echo'};
const ARITHM_REQUEST = {type: 'arithm', content: '(() => {let res = 0; for(let i = 0; i < 2000000000; i++) {res+=i} return res})()'};

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
    while (true)
    {
        // Send echo requests
        console.log('Sending echo requests...');
        await sendRequest(ECHO_REQUEST, 500, 1);
        console.log('Requests sent');

        // Send arithmetic requests
        console.log('Sending arithmetic requests...');
        await sendRequest(ARITHM_REQUEST, 5, 1);
        console.log('Requests sent');
    }
}

main();