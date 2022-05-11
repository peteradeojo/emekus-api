import { Router } from 'express';
import { getTokenFromHeader } from '../config/tokens';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { secret } from '../config/auth';

const router = Router();

export default function () {
	router.get('/', async (req, res) => {
		const token = getTokenFromHeader(req) as string;
		const data: any = jwt.verify(token, secret as string);

		// const user = await User.findOne({ username: data.username }, '-password');

		if (!data) {
			return res.status(404).json({ error: 'User not found' });
		}

		return res.json({ user: data.user });
	});

	return router;
}
