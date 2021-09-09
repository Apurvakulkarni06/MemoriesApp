
import express from 'express';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();

import { getPosts, createPost, updatePost, deletePost, likePost } from '../controllers/posts.js'


router.get('/',  getPosts);
router.post('/', authMiddleware, createPost);
router.patch('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware,  deletePost);
router.patch('/:id/likePost', authMiddleware, likePost);

export default router;