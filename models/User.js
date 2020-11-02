const mongoose = require('mongoose');
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

const User = mongoose.model('User', userSchema);

module.exports = { User };
