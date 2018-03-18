const http2 = require('http2');
const fs = require('fs');
const mime = require('mime-types');

const key = fs.readFileSync('localhost.key');
const cert = fs.readFileSync('localhost.cert');

const server = http2.createSecureServer(
    { key, cert },
    onRequest,
);




function onRequest(req, res)
{
    const {
        HTTP2_HEADER_PATH,
        HTTP2_HEADER_STATUS
    } = http2.constants;

    let filePath = req.headers[':path'];
    if(filePath.indexOf('?') !== -1)
    {
        filePath = filePath.substring(0, filePath.indexOf('?'));
    }
    filePath = filePath==='/' || filePath==='/index' ? '/index.html' : filePath;

    function statCheck(stat, headers)
    {
        headers['last-modified'] = stat.mtime.toUTCString();

        if(filePath==='/index.html')
        {}

    }

    function push (stream, path) {
        let file   = fs.openSync(`./public/${path}`, 'r');
        const stat = fs.fstatSync(file);
        const contentType = mime.lookup(`./public/${path}`);
        file.headers = {
            'content-length': stat.size,
            'last-modified': stat.mtime.toUTCString(),
            'content-type': contentType
        };

        if (!file)
        {
            return
        }

        stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (pushStream) =>
        {
            pushStream.respondWithFD(file, file.headers);
        })
    }

    function onError(err)
        {
        res.stream.end('<h1>Error 404</h1>');
    }

    console.log(filePath);
    if (filePath === '/index.html')
    {
        push(res.stream, 'app.js');
        push(res.stream, 'site.css');

        const fileDescriptor = fs.openSync(`./public${filePath}`, 'r');
        const stat = fs.fstatSync(fileDescriptor);
        const contentType = mime.lookup(`./public${filePath}`);
        res.stream.respondWithFD(fileDescriptor,  {
            'content-length': stat.size,
            'last-modified': stat.mtime.toUTCString(),
            'content-type': contentType
        });
    }
    else
    {
        res.stream.respondWithFile(
            `./public${filePath}`,
            { 'content-type': 'text/html' },
            { statCheck, onError });
    }
}

server.listen(8443);