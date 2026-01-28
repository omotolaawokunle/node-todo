const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    methods: {
        verifyPassword(password) {
            return crypto.timingSafeEqual(
              Buffer.from(this.hashPassword(password), "hex"),
              Buffer.from(this.password, "hex"),
            );
        },
        hashPassword(password) {
            return crypto.pbkdf2Sync(password, process.env.HASH_SECRET, 32000, 32, 'sha256').toString('hex');
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;