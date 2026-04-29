// services/generateBlog.js
import Blog from "../models/blog.schema.js";

// Simple service just returns a blog object skeleton
export const generateBlog = (topic) => {
  return {
    title: topic,
    content: [], // empty, editor will fill this
  };
};


export const getAllBlogs = async () => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return blogs;
};


export const getBlogById = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new Error("Blog not found");
  return blog;
};