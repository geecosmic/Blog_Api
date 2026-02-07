import Post from "../models/Post.js";

/* ================= CREATE ================= */
export const createPost = async (req, res, next) => {
  try {
    const { title, content, tags, status } = req.body;

    const post = await Post.create({
      title,
      content,
      tags: tags || [],
      status: status || "draft",
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name email");

    res.status(201).json({ success: true, data: populatedPost });
  } catch (err) {
    next(err);
  }
};

/* ================= GET LIST ================= */
export const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);

    const { search, tag, author, status } = req.query;
    const query = { deletedAt: null };

    // PUBLIC
    if (!req.user) {
      query.status = "published";
    } 
    // AUTHENTICATED
    else {
      if (status === "draft") {
        query.status = "draft";
        query.author = req.user._id;
      } else {
        query.status = "published";
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) query.tags = tag;
    if (author) query.author = author;

    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET SINGLE (PUBLIC) ================= */
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: "published",
      deletedAt: null,
    }).populate("author", "name email");

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

/* ================= GET MY POST (FOR EDITING) ================= */
export const getMyPostById = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user._id,
      deletedAt: null,
    }).populate("author", "name email");

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

/* ================= UPDATE ================= */
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, deletedAt: null });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { title, content, tags, status } = req.body;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;
    if (status !== undefined) post.status = status;

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name email");

    res.json({ success: true, data: populatedPost });
  } catch (err) {
    next(err);
  }
};

/* ================= DELETE (SOFT) ================= */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, deletedAt: null });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    post.deletedAt = new Date();
    await post.save();

    res.json({ success: true, message: "Post deleted (soft delete)" });
  } catch (err) {
    next(err);
  }
};
