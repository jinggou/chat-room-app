const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        status: { type: String, default: 'LOGGED_OUT' },
    },
);

UserSchema.pre('save', async function() {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    // generate a salt
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    // hash the password and store hash in DB
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
});

UserSchema.statics.checkUser = async function checkUser(username, password) {
    const user = await this.findOne({ username });
    if (!user) {
        return false;
    }
    return bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User,
};
