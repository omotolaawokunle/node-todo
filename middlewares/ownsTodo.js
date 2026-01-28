const Todo = require('../models/todo');
const ownsTodo = async (req, res, next) => {
    try {
        let todo = await Todo.findOne({ slug: req.params.id });
        if (!todo) {
            req.session.messages = { errors: { todo: 'Todo not found' } };
            return req.session.save((err) => {
                if (err) return next(err);
                res.redirect('/todos');
            });
        }
        if (req.user._id.toString() !== todo.userId.toString()) {
            req.session.messages = { errors: { todo: 'You are not allowed to access this todo' } };
            return req.session.save((err) => {
                if (err) return next(err);
                res.redirect('/todos');
            });
        }
        req.session.todo = todo;
        return req.session.save((err) => {
            if (err) return next(err);
            next();
        });
    } catch (error) {
        next(error);
    }
};

module.exports = ownsTodo;