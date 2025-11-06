import {listUsers,
getUserById as getUserByIdSvc,
registerUser as registerUserSvc,
updateUserById as updateUserByIdSvc,
deleteUserById as deleteUserByIdSvc,
getUserByEmail as getUserByEmailSvc } from "../services/userService.js";
import {checkPassword, hashPassword} from "../middleware/passHashMiddleware.js";
import{getToken} from "../middleware/authMiddleware.js";

export async function getUsers(req, res){
    try {
        const rows = await listUsers();
        return res.json(rows);
    } catch (err) {
        console.error('getUsers error:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
}

export async function loginUser(req, res){
    try {
        const {email, password} = req.validated?.body ?? req.body;
        const row = await getUserByEmailSvc(email)
        if (!row) return res.status(401).json({ error: "Invalid credentials"})
        if (await checkPassword(password, row.password_hash)) {
            const token = getToken(row)
            return res.json({token});
        }
        return res.status(401).json({error: "Invalid credentials"})
    } catch (err) {
        console.error('loginUser error:', err);
        return res.status(500).json({error: ' Failed to login user'})
    }
}

export async function getUserById(req, res){
    try {
        const id = Number(req.validated?.params?.id ?? req.params.id);
        const row = await getUserByIdSvc(id);
        if (!row) return res.status(404).json({ error: `User not found with id: ${id}` });
        return res.json(row);
    } catch (err) {
        console.error('getUserById error:', err);
        return res.status(500).json({ error: 'Failed to fetch user' });
    }
}

export async function getUserByEmail(req, res) {
    try {
        const {email} = req.validated?.body ?? req.body;
        const row = await getUserByEmailSvc(email);
        if (!row) return res.status(404).json({ error : `User not found with email: ${email}` });
        return res.json(row);
    } catch (error){
        console.error('getUserByEmailReq', error)
        return res.status(500).json({ error: 'Failed to fetch user'})
    }
}

export async function registerUser(req, res){
    try {
        await lookForDuplicateEmail(req, res)
        const data = await buildUserBody(req);
        await registerUserSvc(data);
        return res.status(201).json({ message :"User registered successfully"});
    } catch (err) {
        console.error('registerUser error:', err);
        return res.status(500).json({ error: 'Failed to register user'});
    }
}

export async function updateUserById(req, res) {
  try {
    // if :id missing (PUT /auth/update), fall back to the token user id
    const idFromParams = req.validated?.params?.id ?? req.params?.id;
    const id = Number(idFromParams ?? req.user?.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid or missing user id" });
    }


    const data = await buildUserBody(req);

    const updated = await updateUserByIdSvc(id, data);
    return res.json(updated);
  } catch (err) {
    console.error("updateUserById error:", err);
    return res.status(500).json({ error: "Failed to update user" });
  }
}

export async function deleteUserById(req, res){
    try {
        const id = Number(req.validated?.params?.id ?? req.params.id);
        await deleteUserByIdSvc(id);
        return res.status(204).send();
    } catch (err) {
        console.error('deleteUserById error:', err);
        return res.status(500).json({ error: 'Failed to delete user' });
    }

}

async function buildUserBody(req){
    const {name, email, password} = req.validated?.body ?? req.body;
    let data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (password !== undefined) data.password_hash = await hashPassword(password);
    console.log(data)
    return data;
}

async function lookForDuplicateEmail (req,) {
    const {email} = req.validated?.body ?? req.body;
    const user = await getUserByEmailSvc(email);
    if(user) {
        throw new Error('Email already in use')
    }
}
