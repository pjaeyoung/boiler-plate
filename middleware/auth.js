const { User } = require('../models/User');

const auth = (req, res, next) => {
	// 인증처리
	// 클라이언트 쿠키에서 토큰 가져오기
	const token = req.cookies['x_auth'];
	// 토큰 복호화 한 후 유저 찾기
	User.findByToken(token)
		.then((user) => {
			if (!user) throw Error('잘못된 토큰입니다.');
			req.token = token;
			req.user = user;
			next();
		})
		.catch(({ message }) => {
			res.json({ isAuth: false, message });
		});
};

module.exports = { auth };
