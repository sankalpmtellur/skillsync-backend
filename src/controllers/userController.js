import prisma from "../prisma.js";

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                skills: true,
                experience: true,
                location: true,
                createdAt: true
            }
        });

        // Transform the data to match frontend expectations
        const transformedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            title: "Developer", // Default title since we don't have this field
            skills: user.skills ? user.skills.split(',').map(skill => skill.trim()) : [],
            experience: user.experience || "Beginner",
            location: user.location || "Remote",
            availability: "Flexible", // Default since we don't have this field
            projects: 0, // Default since we don't track this
            rating: 4.5, // Default rating
            bio: `Passionate developer with expertise in ${user.skills || 'various technologies'}.`,
            avatar: `/src/assets/avatars/avatar${(user.id % 6) + 1}.png`, // Use avatar based on ID
            verified: user.id % 2 === 0, // Alternate verification for demo
            joined: new Date(user.createdAt).getFullYear().toString()
        }));

        res.json(transformedUsers);

    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                skills: true,
                experience: true,
                location: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const transformedUser = {
            id: user.id,
            name: user.name,
            title: "Developer",
            skills: user.skills ? user.skills.split(',').map(skill => skill.trim()) : [],
            experience: user.experience || "Beginner",
            location: user.location || "Remote",
            availability: "Flexible",
            projects: 0,
            rating: 4.5,
            bio: `Passionate developer with expertise in ${user.skills || 'various technologies'}.`,
            avatar: `/src/assets/avatars/avatar${(user.id % 6) + 1}.png`,
            verified: user.id % 2 === 0,
            joined: new Date(user.createdAt).getFullYear().toString()
        };

        res.json(transformedUser);

    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};
