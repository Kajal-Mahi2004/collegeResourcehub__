const Subject = require("../models/Subject");
const Course = require("../models/Course");
const Branch = require("../models/Branch");
const Semester = require("../models/Semester");


// import axios from "axios";

// GET ALL SUBJECTS
const getAllSubjects = async (req, res) => {
  try {
    const { courseId, branchId, semesterId } = req.query;
    
    let query = {};
    if (courseId) query.course = courseId;
    if (branchId) query.branch = branchId;
    if (semesterId) query.semester = semesterId;
    
    const subjects = await Subject.find(query)
      .populate("course", "name")
      .populate("branch", "name code")
      .populate("semester", "number");
    
    res.status(200).json({
      message: "Subjects fetched successfully",
      subjects
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SUBJECTS BY COURSE, BRANCH, SEMESTER
const getSubjectsByFilter = async (req, res) => {
  try {
    const { courseId, branchId, semesterId } = req.params;
    
    const query = {
      course: courseId,
      branch: branchId,
      semester: semesterId
    };
    
    const subjects = await Subject.find(query)
      .populate("course", "name")
      .populate("branch", "name code")
      .populate("semester", "number");
    
    res.status(200).json({
      message: "Subjects fetched successfully",
      subjects
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE SUBJECT
const getSubject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findById(id)
      .populate("course", "name")
      .populate("branch", "name code")
      .populate("semester", "number");
    
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }
    
    res.status(200).json({
      message: "Subject fetched successfully",
      subject
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// CREATE SUBJECT (ADMIN ONLY)
const createSubject = async (req, res) => {
  try {
    const { name, code, courseId, branchId, semesterId, description, credits } = req.body;
    
    if (!name || !code || !courseId || !branchId || !semesterId) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }
    
    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    
    // Verify branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({
        message: "Branch not found"
      });
    }
    
    // Verify semester exists
    const semester = await Semester.findById(semesterId);
    if (!semester) {
      return res.status(404).json({
        message: "Semester not found"
      });
    }
    
    const subject = await Subject.create({
      name,
      code,
      course: courseId,
      branch: branchId,
      semester: semesterId,
      description: description || "",
      credits: credits || 3
    });
    
    res.status(201).json({
      message: "Subject created successfully",
      subject
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE SUBJECT (ADMIN ONLY)
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, credits } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (code) updateData.code = code;
    if (description) updateData.description = description;
    if (credits) updateData.credits = credits;
    
    const subject = await Subject.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("course", "name")
      .populate("branch", "name code")
      .populate("semester", "number");
    
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }
    
    res.status(200).json({
      message: "Subject updated successfully",
      subject
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE SUBJECT (ADMIN ONLY)
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findByIdAndDelete(id);
    
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }
    
    res.status(200).json({
      message: "Subject deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectsByFilter,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
};





// etra code dekhmen ke liye bas 
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AddSubject = () => {
//   const [courses, setCourses] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [semesters, setSemesters] = useState([]);

//   const [formData, setFormData] = useState({
//     courseId: "",
//     branchId: "",
//     semesterId: "",
//     name: "",
//     code: "",
//     description: "",
//     credits: 3
//   });

//   // LOAD COURSES
//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const res = await axios.get("/api/courses");

//       setCourses(res.data.courses);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // COURSE CHANGE
//   const handleCourseChange = async (e) => {
//     const courseId = e.target.value;

//     setFormData({
//       ...formData,
//       courseId,
//       branchId: "",
//       semesterId: ""
//     });

//     try {
//       const res = await axios.get(
//         `/api/branches/course/${courseId}`
//       );

//       setBranches(res.data.branches);
//       setSemesters([]);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // BRANCH CHANGE
//   const handleBranchChange = async (e) => {
//     const branchId = e.target.value;

//     setFormData({
//       ...formData,
//       branchId,
//       semesterId: ""
//     });

//     try {
//       const res = await axios.get(
//         `/api/semesters/branch/${branchId}`
//       );

//       setSemesters(res.data.semesters);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // INPUT CHANGE
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   // SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         "/api/subjects",
//         formData
//       );

//       alert("Subject Added Successfully");

//       console.log(res.data);

//       setFormData({
//         courseId: "",
//         branchId: "",
//         semesterId: "",
//         name: "",
//         code: "",
//         description: "",
//         credits: 3
//       });

//       setBranches([]);
//       setSemesters([]);
//     } catch (error) {
//       console.log(error);
//       alert("Error adding subject");
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Add Subject</h2>

//       <form onSubmit={handleSubmit}>

//         {/* COURSE */}
//         <select
//           value={formData.courseId}
//           onChange={handleCourseChange}
//           required
//         >
//           <option value="">Select Course</option>

//           {courses.map((course) => (
//             <option
//               key={course._id}
//               value={course._id}
//             >
//               {course.name}
//             </option>
//           ))}
//         </select>

//         <br />
//         <br />

//         {/* BRANCH */}
//         <select
//           value={formData.branchId}
//           onChange={handleBranchChange}
//           required
//         >
//           <option value="">
//             Select Branch
//           </option>

//           {branches.map((branch) => (
//             <option
//               key={branch._id}
//               value={branch._id}
//             >
//               {branch.name}
//             </option>
//           ))}
//         </select>

//         <br />
//         <br />

//         {/* SEMESTER */}
//         <select
//           value={formData.semesterId}
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               semesterId: e.target.value
//             })
//           }
//           required
//         >
//           <option value="">
//             Select Semester
//           </option>

//           {semesters.map((semester) => (
//             <option
//               key={semester._id}
//               value={semester._id}
//             >
//               Semester {semester.number}
//             </option>
//           ))}
//         </select>

//         <br />
//         <br />

//         {/* SUBJECT NAME */}
//         <input
//           type="text"
//           name="name"
//           placeholder="Subject Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />

//         <br />
//         <br />

//         {/* SUBJECT CODE */}
//         <input
//           type="text"
//           name="code"
//           placeholder="Subject Code"
//           value={formData.code}
//           onChange={handleChange}
//           required
//         />

//         <br />
//         <br />

//         {/* DESCRIPTION */}
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//         />

//         <br />
//         <br />

//         {/* CREDITS */}
//         <input
//           type="number"
//           name="credits"
//           placeholder="Credits"
//           value={formData.credits}
//           onChange={handleChange}
//         />

//         <br />
//         <br />

//         <button type="submit">
//           Add Subject
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddSubject;