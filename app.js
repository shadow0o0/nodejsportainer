// app.js

const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/mydb', { useNewUrlParser: true });

// Create a blog post schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a blog post model
const Post = mongoose.model('Post', postSchema);

// Create an Express app
const app = express();

// Add middleware
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the blog!');
});

app.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post('/posts', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  await post.save();
  res.json(post);
});

app.put('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send('Post not found');

  post.title = req.body.title;
  post.content = req.body.content;
  post.updatedAt = Date.now();

  await post.save();
  res.json(post);
});

app.delete('/posts/:id', async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).send('Post not found');

  res.json(post);
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});