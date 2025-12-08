import prisma from "../prisma.js";

export const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            status,
            teamSize,
            duration,
            difficulty,
            progress,
            tags,
            featured
        } = req.body;

        const ownerId = req.userId; // coming from auth middleware

        if (!ownerId) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                category,
                status,
                teamSize: Number(teamSize),
                duration,
                difficulty,
                progress: progress ? Number(progress) : null,
                tags: tags || null,
                featured: featured || false,
                ownerId
            }
        });

        res.status(201).json({
            msg: "Project created successfully",
            project
        });

    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                owner: {
                    select: { id: true, name: true, email: true, skills: true }
                }
            }
        });

        res.json(projects);

    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.userId;

        const {
            title,
            description,
            category,
            status,
            teamSize,
            duration,
            difficulty,
            progress,
            tags,
            featured
        } = req.body;

        const updated = await prisma.project.updateMany({
            where: { id: Number(id), ownerId },
            data: {
                title,
                description,
                category,
                status,
                teamSize: Number(teamSize),
                duration,
                difficulty,
                progress: progress ? Number(progress) : null,
                tags,
                featured
            }
        });

        if (updated.count === 0) {
            return res.status(404).json({ msg: "Project not found or not yours" });
        }

        res.json({ msg: "Project updated successfully" });

    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.userId;

        const deleted = await prisma.project.deleteMany({
            where: { id: Number(id), ownerId }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ msg: "Project not found or not yours" });
        }

        res.json({ msg: "Project deleted successfully" });

    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};