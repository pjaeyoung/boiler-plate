const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10; // salt 자리수

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50,
	},
	email: {
		type: String,
		trim: true, // 스페이스 없애기
		unique: 1,
	},
	password: {
		type: String,
		minLength: 5,
	},
	lastname: {
		type: String,
		maxlength: 50,
	},
	role: {
		type: Number, // 0이면 일반유저 1이면 관리자
		default: 0,
	},
	image: String,
	token: {
		type: String,
	},
	tokenExp: {
		type: Number,
	},
});

userSchema.pre('save', function (next) {
	const user = this;
	// 비밀번호 암호화

	if (!user.isModified('password')) return next();

	bcrypt
		.genSalt(saltRounds)
		.then((salt) => {
			return bcrypt.hash(user.password, salt);
		})
		.then((hash) => {
			user.password = hash;
			next();
		})
		.catch((err) => {
			next(err);
		});
});

userSchema.methods.comparePassword = function (plainPassword) {
	const user = this;
	return bcrypt
		.compare(plainPassword, user.password)
		.then((isMatched) => ({ isMatched, user }));
};

userSchema.methods.generateToken = function () {
	const user = this;
	const token = jwt.sign(`${user._id}`, 'secretToken');
	user.token = token;
	return user.save();
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
