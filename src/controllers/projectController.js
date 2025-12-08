import prisma from "../prisma.js";

export const createProject = async (req, res) => {
    const { title, description, skill } = req.body;
    const ownerId = req.userId;

    try {
        const project = await prisma.project.create({
            data: { title, description, skill, ownerId },
        });
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: { owner: { select: { id: true, name: true, email: true, skills: true } } },
        });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const updateProject = async (req, res) => {
    const { id } = req.params;
    const { title, description, skill } = req.body;
    const ownerId = req.userId;

    try {
        const project = await prisma.project.updateMany({
            where: { id: Number(id), ownerId },
            data: { title, description, skill },
        });

        if (project.count === 0) return res.status(404).json({ msg: "Project not found or not yours" });

        res.json({ msg: "Project updated successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const deleteProject = async (req, res) => {
    const { id } = req.params;
    const ownerId = req.userId;

    try {
        const project = await prisma.project.deleteMany({
            where: { id: Number(id), ownerId },
        });

        if (project.count === 0) return res.status(404).json({ msg: "Project not found or not yours" });

        res.json({ msg: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};