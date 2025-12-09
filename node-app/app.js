const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Node.js Quote App</title>
            <style>
                body { font-family: Arial, margin: 40px; }
                h1 { color: #2c3e50; }
            </style>
        </head>
        <body>
            <h1>Welcome to My Node.js App!</h1>
            <p>Click below to get a random programming quote:</p>
            <a href="/quote">Get Quote</a>
        </body>
        </html>
    `;
    res.send(html);
});

app.get('/quote', async (req, res) => {
    try {
        const response = await axios.get('https://programming-quotes-api.herokuapp.com/quotes/random');
        const quote = response.data.en;
        const author = response.data.author;
        res.send(`<h2>"${quote}"</h2><p>- ${author}</p><a href="/">Back</a>`);
    } catch (error) {
        res.send('<p>Failed to fetch quote. Try again later.</p><a href="/">Back</a>');
    }
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
