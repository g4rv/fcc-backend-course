require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ShortURL = require('./schema.js').URLModel;
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:id', (req, res) => {
    const {id} = req.params
    res.redirect('https://www.freecodecamp.org')
})

app.post('/api/shorturl', (req, res) => {
    const {url} = req.body
    res.json({originalUrl: url, short: 1})
})

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
