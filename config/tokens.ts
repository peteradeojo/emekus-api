import { debug } from 'console';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from './auth';

export const generateAccessToken = (user: {
	username?: string;
	email?: string;
	name?: string;
}) => {
	return jwt.sign({ user }, secret as string, { expiresIn: '1d' });
};

export const getTokenFromHeader = (req: Request) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	// debug(authHeader);
	return token;
};

// export const authenticateToken
