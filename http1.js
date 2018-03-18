const express = require('express');
const shrinkRay = require('shrink-ray');

async function main()
{
    const app = express();
    app.use(require('body-parser').urlencoded({extended: true}));
    app.use(express.static('public'));

    app.listen(3000, () => {});

}

main();