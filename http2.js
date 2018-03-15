const http2 = require('http2');
const fs = require('fs');

const key = fs.readFileSync('localhost.key');
const cert = fs.readFileSync('localhost.cert');

const server = http2.createSecureServer(
    { key, cert },
    onRequest,
);




function onRequest(req, res) {
    console.log(req.headers[':path']);

    function statCheck(stat, headers)
    {
        headers['last-modified'] = stat.mtime.toUTCString();
    }

    function onError(err)
    {
        res.stream.respond({ ':status': 404 });
        res.stream.end();
    }

    //let fileName = req.header[':path'];

    console.log(`./public${req.headers[':path']}`);
    let filePath = req.headers[':path'];
    res.stream.respondWithFile(
        `./public${filePath==='/' || filePath==='/index' ? '/index.html' : filePath}`,
        { 'content-type': 'text/html' },
        { statCheck, onError });
}


server.listen(8443);