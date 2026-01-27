var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('todos/index', { title: 'Todos', user: req.locals.user });
});

router.get('/create', function(req, res, next) {
  res.render('todos/create', { title: 'Create Todo', user: req.locals.user });
});

router.post('/create', function(req, res, next) {
  
});

router.get('/:id', function(req, res, next) {
  res.render('todos/show', { title: 'Todo', user: req.locals.user });
});

router.put('/:id', function(req, res, next) {
  
});

router.delete('/:id', function(req, res, next) {
  
});

module.exports = router;
