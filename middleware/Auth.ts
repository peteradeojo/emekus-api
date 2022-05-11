import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Debug from 'debug';
import { secret } from '../config/auth';

const debug = Debug('server:auth-middleware');

export const verifyToken = (
	req: Request & any,
	res: Response,
	next: NextFunction
) => {
	// req.headers['']
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) return res.status(401).json({ error: 'No token' });

	jwt.verify(token, secret as string, (err: any, user: any) => {
		if (err) {
			debug(err);
			return res
				.status(403)
				.json({ error: 'Forbidden', message: 'Please log in again' });
		}

		req.user = user;
		return next();
	});
};
