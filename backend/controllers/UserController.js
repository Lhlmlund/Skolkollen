import {listUsers,
getUserById as getUserByIdSvc,
registerUser as registerUserSvc,
updateUserById as updateUserByIdSvc,
deleteUserById as deleteUserByIdSvc} from "../services/userService.js";
import {hashPassword} from "../middleware/passHash.js";


export async function getUsers(req, res){
    try {
        const rows = await listUsers();
        return res.json(rows);
    } catch (err) {
        console.error('getUsers error:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
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

export async function registerUser(req, res){
    try {
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
