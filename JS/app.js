const express = require('express');
const database = require('./database'); // Import the database module

const app = express();
const port = 3000;

app.get('/getData', async (req, res) => {
    try {
        const results = await database.getData();
        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
