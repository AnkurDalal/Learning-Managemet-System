import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";
import Loading from "./components/student/Loading";
import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import Navbar from "./components/student/Navbar";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";

function App() {
  const isEducatorRoute = useMatch("/educator/*");
  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />}></Route>
        <Route path="/course-list/:input" element={<CoursesList />}></Route>
        <Route path="/course/:id" element={<CourseDetails />} />

        <Route path="/my-enrollments" element={<MyEnrollments />}></Route>
        <Route path="/player/:courseId" element={<Player />}></Route>
        <Route path="/loading/:path" element={<Loading />}></Route>

        <Route path="/educator" element={<Educator />}>
          <Route path="" element={<Dashboard />}></Route>
          <Route path="add-course" element={<AddCourse />}></Route>
          <Route path="my-courses" element={<MyCourses />}></Route>
          <Route path="student-enrolled" element={<StudentsEnrolled />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
