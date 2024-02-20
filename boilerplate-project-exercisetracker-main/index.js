require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const express = require('express');
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

const User = require('./api/userSchema.js').User;
const Exercise = require('./api/exerciseSchema.js').Exercise;

app.get('/api/users/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findOne({ _id: id });
		if (user) return res.json(user);
		else throw new Error('No such user');
	} catch (err) {
		res.json({ error: err.message });
	}
});

app.post('/api/users', async (req, res) => {
	const { username } = req.body;
	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) return res.json(existingUser);

		const newUser = await new User({
			username,
		}).save();
		if (newUser) res.json({ _id: newUser._id, username: newUser.username });
	} catch (err) {
		console.log(err);
	}
});

app.post('/api/users/:id/exercises', async (req, res) => {
	const { id } = req.params;
	const { description, duration, date } = req.body;
	try {
		const existingUser = await User.findOne({ _id: id });
		if (existingUser) {
			const newExercise = await new Exercise({
				username: existingUser.username,
				description,
				duration,
				date: !date ? new Date().toDateString() : new Date(date).toDateString(),
			}).save();
			if (newExercise) return res.json({
                _id: existingUser._id,
                username: newExercise.username,
				description: newExercise.description,
				duration: newExercise.duration,
				date: newExercise.date,
            });
		} else throw new Error('No such user!');
	} catch (err) {
		res.json({ error: err.message });
	}
});

app.get('/api/users/:id/logs', async (req, res) => {
	const { id } = req.params;
	try {
		const existingUser = await User.findOne({ _id: id });
		if (existingUser) {
			const userExercises = await Exercise.find({
				username: existingUser.username,
			});

			res.json({
				username: existingUser.username,
				count: userExercises.length,
				_id: existingUser._id,
				log: userExercises.map((exercise) => {
					return {
						description: exercise.description,
						duration: exercise.duration,
						date: exercise.date,
					};
				}),
			});
		} else throw new Error('No such user!');
	} catch (err) {
		res.json({ error: err });
	}
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
