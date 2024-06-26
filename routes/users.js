import express from 'express';
import { getAllUsers, getUserByNameOrId, getUserData, updateUserData, userLogin, userRegistration } from '../controllers/user.js';
import verifyToken from '../middleware/authorization.js';

// import { UserLogin } from '../models/user';

const router = express.Router();
router.post("/register", userRegistration);
router.post("/get", getUserData);
router.post("/:id", updateUserData);
router.post("/list", getAllUsers);
router.post("/:id", getUserByNameOrId);

export default router;

