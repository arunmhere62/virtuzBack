import express from 'express';
import { createUserProfile, deleteUserProfileById, getUserProfile, getUserProfileById, updateUserProfileById } from '../controllers/userProfile.js';

const router = express.Router();

router.post("/create", createUserProfile);
router.post("/get/:id", getUserProfileById);
router.post("/update/:id", updateUserProfileById);
router.post("/list", getUserProfile);
router.post("/delete/:id", deleteUserProfileById);

export default router;