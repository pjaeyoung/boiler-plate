const express = require('express');
const mongoose = require('mongoose');
const { User } = require('./models/User');
const config = require('./config/key');

const app = express();
const port = 3000;

mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/register', (req, res) => {
	// 회원가입에 필요한 정보들을 client에서 가져와 데이터베이스에 저장
	const user = new User(req.body);
	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

app.post('/login', (req, res) => {
	const { email, password } = req.body;
	// 요청된 이메일을 데이터베이스에서 있는지 찾는다.
	User.findOne({ email })
		.then((user) => {
			if (!user) {
				throw Error('제공된 이메일에 해당하는 유저가 없습니다.');
			}
			// 요청된 이메일이 데이터 베이스에 있다면 맞는 비밀번호인지 확인.
			return user.comparePassword(password);
		})
		.then(({ isMatched, user }) => {
			// 비밀번호까지 맞다면 토큰을 생성하기.
			if (!isMatched) {
				throw Error('패스워드가 일치하지 않습니다.');
			}
			return user.generateToken();
		})
		.then((user) => {
			// 쿠키에 저장
			res
				.cookie('x_auth', user.token)
				.status(200)
				.json({ loginSuccess: true, userId: user._id });
		})
		.catch(({ message }) => {
			res.json({ loginSuccess: false, message });
		});
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
