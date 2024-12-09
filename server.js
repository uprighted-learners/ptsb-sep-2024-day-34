// server.js
const express = require('express');
const app = express();
const PORT = 8080;

// GET - /api/health - returns a string "Hello World!"
app.get('/api/health', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});