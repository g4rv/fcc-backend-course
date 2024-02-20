require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ShortURL = require('./schema.js').URLModel;
const dns = require('node:dns')
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

app.get('/api/shorturl/:id', async (req, res) => {
    const {id} = req.params
    console.log(id, typeof id)
    try {
        const shortenedURL = await ShortURL.findOne({shortURL: Number(id)})
        if(shortenedURL) {
            return res.redirect(shortenedURL.originalURL)
        }
        console.log('Error', shortenedURL)
    } catch (err) {
    }
})

app.post('/api/shorturl', async (req, res) => {
    const {url} = req.body
    const isInvalidURL = !/^http(s|):\/\/(w{3}\.|)[a-zA-Z0-9-_]+(\.\w{2,3}|:\d{4})(\/\w+|)/.test(url)
    if(isInvalidURL) {
        console.log(url)
        res.json({error: 'invalid url'})
        return 
    }

    try {
        const existingURL = await ShortURL.findOne({ originalURL: url });

        if (existingURL) {
            return res.json({ original_url: url, short_url: existingURL.shortURL });
        }

        const documentCount = await ShortURL.estimatedDocumentCount()
        new ShortURL({
            originalURL: url,
            shortURL: documentCount + 1
        }).save()
        return res.json({ original_url: url, short_url: documentCount + 1 })
    } catch(err) {
        throw new Error(`Somthing went wrong: ${err}`)
    }
})

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
