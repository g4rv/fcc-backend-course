require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	age: Number,
	favoriteFoods: [String],
});

const Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
	const person = new Person({
		name: 'John',
		age: 23,
		favoriteFoods: ['pizza', 'pasta'],
	});
	person.save((err, data) => {
		if (err) return console.error(err);
		done(null, data);
	});
};

const createManyPeople = (arrayOfPeople, done) => {
	Person.create(arrayOfPeople, (err, data) => {
		if (err) return console.error(err);
		done(null, data);
	});
};

const findPeopleByName = (personName, done) => {
	Person.find({ name: personName }, (err, data) => {
		if (err) return console.error(err);
		done(null, data);
	});
};

const findOneByFood = (food, done) => {
	Person.findOne({ favoriteFoods: food }, (err, data) => {
		if (err) return console.error(err);
		done(null, data);
	});
};

const findPersonById = (personId, done) => {
	Person.findById(personId, (err, data) => {
		if (err) return console.error(err);
		done(null, data);
	});
};

const findEditThenSave = (personId, done) => {
	const foodToAdd = 'hamburger';
	Person.findById(personId, (err, person) => {
		if (err) return console.error(err);

		person.favoriteFoods.push(foodToAdd);

		person.save((err, data) => {
			if (err) return console.error(err);
			done(null, data);
		});
	});
};

const findAndUpdate = (personName, done) => {
	const ageToSet = 20;
	Person.findOneAndUpdate(
		{ name: personName },
		{ age: ageToSet },
		{ new: true },
		(err, updatedDoc) => {
			if (err) return console.log(err);
			done(null, updatedDoc);
		}
	);
};

const removeById = (personId, done) => {
	Person.findByIdAndRemove(personId, (err, removedDoc) => {
		if (err) return console.log(err);
		done(null, removedDoc);
	});
};

const removeManyPeople = (done) => {
	const nameToRemove = 'Mary';
	Person.remove({ name: nameToRemove }, (err, data) => {
		if (err) return console.error(err);
		done(null, data);
	});
};

const queryChain = (done) => {
	const foodToSearch = 'burrito';
	Person.find({ favoriteFoods: {$in: [foodToSearch]} })
		.sort({ name: 1 })
		.limit(2)
		.select({age: 0})
		.exec((err, data) => {
			if (err) return console.log(err);
			done(null, data);
		});
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
