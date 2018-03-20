const express = require('express');
const shrinkRay = require('shrink-ray');
const fs = require('fs');
const zlib = require('zlib');

async function main()
{
    const app = express();

    app.use(shrinkRay());
    app.use(express.static('public'));
    app.listen(3000, ()=> {});
}

main();