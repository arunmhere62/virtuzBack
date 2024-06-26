import express from 'express';
import { deleteUserProfileById, getUserProfile, getUserProfileByUsername, updateUserProfileById } from '../controllers/userProfile.js';
import { userRegistration } from '../controllers/user.js';

const router = express.Router();

router.post("/create", userRegistration);
router.post("/get", getUserProfileByUsername);
router.post("/update/:id", updateUserProfileById);
router.post("/list", getUserProfile);
router.post("/delete/:id", deleteUserProfileById);

export default router;