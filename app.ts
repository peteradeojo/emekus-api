import express, { Request } from 'express';
import Debug from 'debug';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const debug = Debug('server:app');

const app = express();

if (app.get('env') !== 'production') {
	dotenv.config();
	app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import indexRouter from './routes/index.route';
import authRoute from './routes/auth.route';
import { secret as jwtSecret } from './config/auth';
import User from './models/user.model';
import { generateAccessToken } from './config/tokens';
import { verifyToken } from './middleware/Auth';

// MongoDB Connection
(async () => {
	try {
		const {
			connection: { host, port },
		} = await mongoose.connect(process.env.MONGO_URI as string, {
			connectTimeoutMS: 60000,
		});

		debug(`MongDB listening on ${host}:${port}`);
	} catch (error) {}
})();

app.post('/register', async (req, res) => {
	const { name, username, email, password } = req.body;
	try {
		const user = new User({
			name,
			username,
			email,
			password: bcrypt.hashSync(password, 10),
		});

		await user.save();

		jwt.sign({ user }, jwtSecret as string, (err: any, token: any) => {
			return res.json({ user, token });
		});
	} catch (error: any) {
		return res.status(500).json({ error: error });
	}
});

app.post('/login', async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const user = await User.findOne({ $or: [{ email }, { username }] });
		if (user) {
			// debug(user);
			const compare = bcrypt.compareSync(password, user.password);
			if (compare) {
				const token = generateAccessToken(user);
				return res.json({ token });
			}
			return res.status(404).json({ error: 'Invalid Password' });
		}
		return res.status(404).json({ error: 'User not found' });
	} catch (error: any) {
		return res.status(500).json({ error: error.stack });
	}
});

app.use('/auth', verifyToken, authRoute());

app.use('/', verifyToken, indexRouter());

const port = process.env.PORT || 5000;

app.listen(port, () => debug(`Server running on port ${port}`));
