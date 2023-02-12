require('dotenv').config();
const express = require('express');
const app = express();
const port = 3333;
const { getS3Images } = require('./aws');

app.use(express.json());
app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));

app.get('/images', (req, res) => {
  getS3Images().then(response => res.send(response));
});

app.listen(port, () => {
    console.log(`server deployed on port ${port}`)
});
