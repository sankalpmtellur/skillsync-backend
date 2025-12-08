import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import prisma from "../prisma.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
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

    // Transform the data to match frontend expectations
    const transformedUser = {
      id: user.id,
      name: user.name,
      title: "Developer", // Default title since we don't have this field
      email: user.email,
      skills: user.skills ? user.skills.split(',').map(skill => skill.trim()) : [],
      experience: user.experience || "Beginner",
      location: user.location || "Remote",
      bio: `Passionate developer with expertise in ${user.skills || 'various technologies'}.`,
      avatar: `/src/assets/avatars/avatar${(user.id % 6) + 1}.png`, // Use avatar based on ID
      joined: new Date(user.createdAt).getFullYear().toString(),
      projects: 0, // Default since we don't track this yet
      collaborators: 0, // Default since we don't track this yet
      views: 0 // Default since we don't track this yet
    };

    res.json(transformedUser);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { skills, experience, location, bio } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        skills: skills ? skills.join(',') : "",
        experience: experience || "",
        location: location || ""
      },
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
    const transformedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      title: "Developer",
      email: updatedUser.email,
      skills: updatedUser.skills ? updatedUser.skills.split(',').map(skill => skill.trim()) : [],
      experience: updatedUser.experience || "Beginner",
      location: updatedUser.location || "Remote",
      bio: bio || `Passionate developer with expertise in ${updatedUser.skills || 'various technologies'}.`,
      avatar: `/src/assets/avatars/avatar${(updatedUser.id % 6) + 1}.png`,
      joined: new Date(updatedUser.createdAt).getFullYear().toString(),
      projects: 0,
      collaborators: 0,
      views: 0
    };

    res.json({ msg: "Profile updated successfully", user: transformedUser });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;