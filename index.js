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

app.listen(port, () => console.log(`Example app listening on port ${port}`));
