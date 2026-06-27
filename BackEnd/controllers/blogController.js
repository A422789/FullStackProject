const Blog = require('../models/Blog');

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Private (Admin only)
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private (Admin only)
exports.createBlog = async (req, res) => {
  try {
    const { title, category, status, description, date, views, author } = req.body;
    const authorName = author || (req.user ? req.user.name : 'Admin');

    const blog = await Blog.create({
      title,
      category,
      status: status ? status.toLowerCase() : 'draft',
      description,
      date,
      views,
      author: authorName,
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update an existing blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin only)
exports.updateBlog = async (req, res) => {
  try {
    const { title, category, status, description, date, views, author } = req.body;

    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        status: status ? status.toLowerCase() : blog.status,
        description,
        date,
        views,
        author: author || blog.author,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin only)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
