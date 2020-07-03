import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
	email: string;
	password: string;
}

// Interface that describes the properties that the user model has
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// Inteface that describes what the user Document has
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await Password.toHash(this.get("password"));
		this.set("password", hashed);
	}
	done();
});

userSchema.statics.build = function buildUser(attrs: UserAttrs) {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
