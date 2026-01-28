const Todo = require('../models/todo');

async function getTodos(req, res, next) {
    let status = '';
    if(['pending', 'completed'].includes(req.query.status)) {
        status = req.query.status;
    }
    let query = { userId: req.user._id };
    if (status) {
        query.status = status;
    } else {
        query.status = { $ne: 'deleted' };
    }
    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.render('todos/index', { todos, user: req.user, message: req.session?.messages?.message, errors: req.session?.messages?.errors, status });
}

async function createTodo(req, res, next) {
    const { title, description } = req.body;
    let slug = title.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
    const todo = new Todo({ title, description, userId: req.user._id, slug, status: 'pending' });
    await todo.save();
    res.redirect('/todos');
}

async function getTodo(req, res, next) {
    const todo = req.session.todo;
    res.render('todos/show', { todo, user: req.user });
}

async function updateTodo(req, res, next) {
    const { status } = req.body;
    if (!['completed', 'deleted'].includes(status)) {
        req.session.messages = { errors: { todo: 'Invalid status, only completed and deleted are allowed' } };
        return req.session.save((err) => {
            if (err) return next(err);
            res.redirect('/todos');
        });
    }
    const todo = req.session.todo;
    todo.status = status;
    if (status === 'completed') {
        todo.completedAt = new Date();
    } else if (status === 'deleted') {
        todo.deletedAt = new Date();
    }
    await todo.save();
    req.session.messages = { message: 'Todo updated successfully' };
    return req.session.save((err) => {
        if (err) return next(err);
        res.redirect('/todos');
    });
}

async function deleteTodo(req, res, next) {
    const todo = req.session.todo;
    await todo.deleteOne();
    req.session.messages = { message: 'Todo deleted successfully' };
    return req.session.save((err) => {
        if (err) return next(err);
        res.redirect('/todos');
    });
}
module.exports = { createTodo, getTodos, getTodo, updateTodo, deleteTodo };