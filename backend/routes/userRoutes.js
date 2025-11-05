import {loginUser, registerUser} from "../controllers/UserController.js";
import express from "express"
const router = express.Router();

router.get('/login',loginUser)
router.post('/register', registerUser)

export default router;
