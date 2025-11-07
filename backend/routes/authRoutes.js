
import express from "express"
import {getUserById, loginUser, registerUser, updateUserById} from "../controllers/userController.js";
import {authenticateToken} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/login',loginUser)
router.post('/register', registerUser)
router.get('/me', authenticateToken, getUserById)
router.put('/update',authenticateToken, updateUserById)

export default router;
