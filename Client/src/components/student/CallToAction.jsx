import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0 text-center">
      <h1 className="text-xl md:text-4xl text-gray-800 font-semibold">
        Learn anything, anytime, anywhere
      </h1>
      <p className="text-gray-600 text-sm md:text-base max-w-xl">
        Edemy is a user-friendly Learning Management System (LMS) website
        designed to simplify online education. It allows students to enroll in
        courses, track progress, and access learning materials, while
        instructors can manage content, monitor performance, and engage with
        learners.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center font-medium gap-4 mt-4">
        <button className="px-8 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition">
          Get started
        </button>
        <button className="flex items-center gap-2 text-blue-600 hover:underline">
          Learn more <img src={assets.arrow_icon} alt="arrow_icon" />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
