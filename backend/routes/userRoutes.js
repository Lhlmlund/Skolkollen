import express from "express"
import {deleteUserById, getUserById, getUsers, registerUser} from "../controllers/userController.js";
const router = express.Router();

router.get('/users', getUsers)
router.get('/users:id', getUserById)
router.delete('/users:id', deleteUserById)


export default router;
