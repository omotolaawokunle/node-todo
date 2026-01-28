var express = require('express');
const ownsTodo = require("../middlewares/ownsTodo");
const {
  getTodos,
  createTodo,
  updateTodo,
} = require("../controllers/todoController");
var router = express.Router();

router.get("/", getTodos);

router.get("/create", function (req, res, next) {
  res.render("todos/create", { title: "Create Todo", user: req.user });
});

router.post("/create", createTodo);

router.post("/:id", ownsTodo, updateTodo);


module.exports = router;
