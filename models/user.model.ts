import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: String,
});

// const User = mongoose.model("User", userSchema);
export default mongoose.model('User', userSchema);
