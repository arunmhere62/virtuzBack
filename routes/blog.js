import express from 'express';
import { createBlog, blogList, deleteBlogById, getBlogById, updateBlogById } from '../controllers/blog.js';

const router = express.Router();

router.post("/create", createBlog);
router.post("/get/:id", getBlogById);
router.post("/update/:id", updateBlogById);
router.post("/list", blogList);
router.post("/delete/:id", deleteBlogById);

export default router;