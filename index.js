require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { User } = require('./models/User');

const app = express();
const port = 3000;

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGOOSE_NICKNAME}:${process.env.MONGOOSE_PASSWORD}@boilerplate.a9smj.mongodb.net/<dbname>?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		}
	)
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
