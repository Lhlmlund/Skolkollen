import {listUsers,
getUserById as getUserByIdSvc,
registerUser,
updateUserById as updateUserByIdSvc,
deleteUserById as deleteUserByIdSvc} from "../services/userService.js";



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

export async function registerUserById(req, res){

}

export async function updateUserById(req, res){

}

export async function deleteUserById(req, res){

}
