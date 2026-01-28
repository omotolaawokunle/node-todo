const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'completed', 'deleted'], default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  deletedAt: { type: Date, default: null },
  updatedAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;