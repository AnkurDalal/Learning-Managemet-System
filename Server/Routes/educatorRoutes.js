import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
} from "../Controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../Middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// Update user role to educator
educatorRouter.get("/update-role", updateRoleToEducator);

// Add new course (protected route)
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,addCourse
);

// Get all courses by educator (protected)
educatorRouter.get("/courses", protectEducator, getEducatorCourses);

// Get educator dashboard data (protected)
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);

// Get enrolled students data (protected)
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);

export default educatorRouter;
