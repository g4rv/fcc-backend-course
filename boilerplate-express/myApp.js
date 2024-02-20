require('dotenv').config();
const bodyParser = require('body-parser');
let express = require('express');
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path} - ${req.ip}`)
//     next()
// })

// app.get('/now', (req, res, next) => {
//     req.time = new Date().toString()
//     next()
// }, (req, res) => {
//     res.json({time: req.time})
// })
app.route('/name').get((req, res) => {
	var firstName = req.query.first;
	var lastName = req.query.last;
	// OR you can destructure and rename the keys
	var { first: firstName, last: lastName } = req.query;
	// Use template literals to form a formatted string
	res.json({
		name: `${firstName} ${lastName}`,
	});
})
.post((req, res) => {
    const {first, last} = req.body
    res.json({name: `${first} ${last}`})
});
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

app.use('/public', express.static(__dirname + '/public'));

// app.get('/json', (req, res) => {
//     const resMessage = "Hello json"
//     const formatedMessage = process.env.MESSAGE_STYLE === 'uppercase' ? resMessage.toUpperCase() : resMessage
//     res.json({"message": formatedMessage})
// })

// app.get('/:word/echo', (req, res) => {
//     res.json({echo: req.params.word})
// })

module.exports = app;
