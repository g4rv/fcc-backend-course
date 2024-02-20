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

function postNewShortURL(url, done) {
	ShortURL.find({ originalURL: 'url' })
		.limit(1)
		.sort({ $natural: -1 })
		.exec((err, data) => {
			if (!err) done(data);
		});
}

// Your first API endpoint
app.post('/api/shorturl', (req, res) => {
	const { url } = req.body;
	const isValidUrl =
		/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
			url
		);
	if (!isValidUrl) return res.json({ error: 'invalid url' });

	// res.json({ original_url: req.body.url, short_url: 1 });
	postNewShortURL(url, (data) => {
		res.json(data);
	});
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
