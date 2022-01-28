import axios from "axios"

const service = axios.create({
    baseURL: 'https://smpaas.vera.kumori.cloud' || 'http://localhost:8080',
    timeout: 15000,
    headers: {'Content-Type': 'application/json'}
});

//(() => {let res = 0; for(let i = 0; i < 2000000000; i++) {res+=i} return res})()

const ECHO_REQUEST   = {type: 'echo', content: 'echo'};
const ARITHM_REQUEST = {type: 'arithm', content: '11 * 23'};

async function sendRequest(req, times, verbose = false)
{
    let promises = [];
    for(let i = 0; i < times; i++)
    {
        promises.push(service.post('/', req));
    }
    await Promise.all(promises)
        .then(values => { if (verbose) values.forEach(value => console.log(value.data ? value.data : 'timeout')) })
        .catch(err => { if (verbose) console.log(err.message) });
}

async function main()
{
    while (true)
    {
        // Send echo requests
        /* console.log('Sending echo requests...');
        await sendRequest(ECHO_REQUEST, 100000);
        console.log('Requests sent'); */

        // Send arithmetic requests
        console.log('Sending arithmetic requests...');
        await sendRequest(ARITHM_REQUEST, 100, false);
        console.log('Requests sent');
    }
}

main();