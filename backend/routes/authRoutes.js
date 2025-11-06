import {loginUser, registerUser, updateUserById} from "../controllers/userController.js";
import express from "express"
import {authenticateToken} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/login',loginUser)
router.post('/register', registerUser)
router.put('/update',authenticateToken, updateUserById)

export default router;
