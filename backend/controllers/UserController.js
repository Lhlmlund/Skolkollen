import {listUsers,
getUserById as getUserByIdSvc,
registerUser as registerUserSvc,
updateUserById as updateUserByIdSvc,
deleteUserById as deleteUserByIdSvc,
getUserByEmail as getUserByEmailSvc } from "../services/userService.js";
import {checkPassword, hashPassword} from "../middleware/passHash.js";


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
        const email = eq.validated?.body ?? req.body;
        const row = await getUserByEmailSvc(email)
        if (!row) return res.status(401).json({ error: "Invalid credentials"})
        const password = req.body
        if (checkPassword(password, row.password_hash)) {
            return res.json({getToken(row)});
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
        const email = req.validated?.body ?? req.body;
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
        const data = buildUserBody(req);
        const created = await registerUserSvc(data);
        return res.status(201).json(created);
    } catch (err) {
        console.error('registerUser error:', err);
        return res.status(500).json({ error: 'Failed to register user'});
    }
}

export async function updateUserById(req, res){
    try {
        const id = Number(req.validated?.params?.id ?? req.params.id);
        const data = buildUserBody(req);
        const updated = await updateUserByIdSvc(id, data);
        return res.json(updated);
    } catch (err) {
        console.error('updateUserById error:', err);
        return res.status(500).json({ error: 'Failed to update user' });
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

function buildUserBody(req){
    const {name, email, password} = req.validated?.body ?? req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (password !== undefined) data.password_hash = hashPassword(password);
    return data;
}

function lookForDuplicateEmail (req, res) {
    const {email} = req.validated?.body ?? req.body;
    const user = getUserByEmailSvc(email);
    if(user) return res.status(500).json({error: 'Email already in use'})
}

function getToken(row) {
return jwt.sign({})
}
