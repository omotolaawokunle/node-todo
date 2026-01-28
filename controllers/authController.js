const User = require('../models/user');
const passport = require('passport');
const { createUser } = require('../services/auth');

async function register(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        req.session.messages = { message: 'Username and password are required', username: username, password: password, errors: { username: username ? '' : 'Username is required', password: password ? '' : 'Password is required' } };
        return req.session.save((err) => {
            if (err) return next(err);
            res.redirect('/register');
        });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        req.session.messages = { message: 'Username already exists', username: username, password: password, errors: { username: 'Username already exists' } };
        return req.session.save((err) => {
            if (err) return next(err);
            res.redirect('/register');
        });
    }
    const user = await createUser(username, password);
    req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/todos');
    });
}

async function login(req, res, next) {
    console.log(req.body);
    passport.authenticate('local', function(err, user, info) {
        console.log(user);
        if (err) { return next(err); }
        if (!user) {
            console.log('Invalid username or password');
            req.session.messages = { message: 'Invalid username or password' };
            return req.session.save((err) => {
                if (err) return next(err);
                res.redirect('/login');
            });
        }
        req.login(user, function(err) {
            if (err) { return next(err); }
            res.redirect('/todos');
        });
    });
}

module.exports = { register, login };