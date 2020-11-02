require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
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

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}`));
