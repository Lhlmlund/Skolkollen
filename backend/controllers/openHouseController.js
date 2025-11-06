// backend/controllers/openHouseController.js
import {
    listOpenHouseEvents,
    getOpenHouseEventById as getOpenHouseEventByIdSvc,
    createOpenHouseEvent as createOpenHouseEventSvc,
    deleteOpenHouseEventById as deleteOpenHouseEventByIdSvc,
    updateOpenHouseEventById as updateOpenHouseEventByIdSvc,
} from "../services/openHouseService.js";

export async function getOpenHouseEvents(_req, res) {
    try {
        const rows = await listOpenHouseEvents();
        return res.json(rows);
    } catch (err) {
        console.error('getOpenHouseEvents error:', err);
        return res.status(500).json({ error: 'Failed to fetch OpenHouseEvents' });
    }
}

export async function getOpenHouseEventById(req, res) {
    try {
        const id = Number(req.validated?.params?.id ?? req.params.id);
        const row = await getOpenHouseEventByIdSvc(id);
        if (!row) return res.status(404).json({ error: `OpenHouseEvent not found with id: ${id}` });
        return res.json(row);
    } catch (err) {
        console.error('getOpenHouseEventById error:', err);
        return res.status(500).json({ error: 'Failed to fetch openHouseEvent' });
    }
}

export async function getOpenHouseEventBySchoolId(req, res) {
    try {
        return
    } catch (err) {
        console.error()
        return
    }
}

export async function createOpenHouseEvent(req, res) {
    try {
        const data = buildOpenHouseEventBody(req);
        const created = await createOpenHouseEventSvc(data);
        return res.status(201).json(created);
    } catch (err) {
        console.error('createOpenHouseEvent error:', err);
        return res.status(500).json({ error: 'Failed to create OpenHouseEvent' });
    }
}

export async function updateOpenHouseEventById(req, res) {
    try {
        const id = Number(req.validated?.params?.id ?? req.params.id);
        const data = buildOpenHouseEventBody(req);
        const updated = await updateOpenHouseEventByIdSvc(id, data);
        return res.json(updated);
    } catch (err) {
        console.error('updateOpenHouseEventById error:', err);
        return res.status(500).json({ error: 'Failed to update OpenHouseEvent' });
    }
}

export async function deleteOpenHouseEventById(req, res) {
    try {
        const id = Number(req.validated?.params?.id ?? req.params.id);
        await deleteOpenHouseEventByIdSvc(id);
        return res.status(204).send();
    } catch (err) {
        console.error('deleteOpenHouseEventById error:', err);
        return res.status(500).json({ error: 'Failed to delete OpenHouseEvent' });
    }
}

function buildOpenHouseEventBody(req) {
    const { name, category, description } = req.validated?.body ?? req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (description !== undefined) data.description = description;
    return data;
}
