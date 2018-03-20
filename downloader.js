const http = require('http');
const fs = require('fs');
const axios = require('axios');

async function sendRequest(encoding)
{
    fs.writeFile(`./download/default.js`,(await axios(
        {
            method:  'GET',
            url:     '/app.js',
            baseURL: 'http://localhost:3000',
        }
    )).data, ()=>{});
    fs.writeFile(`./download/gzip.js`,(await axios(
        {
            method:  'GET',
            url:     '/app.js',
            baseURL: 'http://localhost:3000',
            headers: {'Accept-Encoding': 'gzip'}
        }
    )).data, ()=>{});
    fs.writeFile(`./download/deflate.js`,(await axios(
        {
            method:  'GET',
            url:     '/app.js',
            baseURL: 'http://localhost:3000',
            headers: {'Accept-Encoding': 'sdch'}
        }
    )).data, ()=>{});

    fs.writeFile(`./download/br.js`,(await axios(
        {
            method:  'GET',
            url:     '/app.js',
            baseURL: 'http://localhost:3000',
            headers: {'Accept-Encoding': 'br'}
        }
    )).data, ()=>{});

}

sendRequest();