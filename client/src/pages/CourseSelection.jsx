import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { courseAPI, branchAPI, semesterAPI } from '../services/api';
import {
  setCoursesSuccess,
  setBranchesSuccess,
  setSemestersSuccess,
  setSelectedCourse,
  setSelectedBranch,
  setSelectedSemester
} from '../redux/slices/academicSlice';

export default function CourseSelection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, branches, semesters, selectedCourse, selectedBranch, selectedSemester } = useSelector(state => state.academic);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getAllCourses();
        dispatch(setCoursesSuccess(response.data.courses));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [dispatch]);

  const handleCourseSelect = async (courseId) => {
    dispatch(setSelectedCourse(courseId));
    try {
      const [branchesRes, semestersRes] = await Promise.all([
        branchAPI.getBranchesByCourse(courseId),
        semesterAPI.getSemestersByCourse(courseId)
      ]);
      dispatch(setBranchesSuccess(branchesRes.data.branches));
      dispatch(setSemestersSuccess(semestersRes.data.semesters));
    } catch (error) {
      console.error('Error fetching branches and semesters:', error);
    }
  };

  const handleBranchSelect = (branchId) => {
    dispatch(setSelectedBranch(branchId));
  };

  const handleSemesterSelect = (semesterId) => {
    dispatch(setSelectedSemester(semesterId));
  };

  const handleProceed = () => {
    if (selectedCourse && selectedBranch && selectedSemester) {
      navigate(`/subjects/${selectedCourse}/${selectedBranch}/${selectedSemester}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">Select Your Course Path</h1>

        {/* Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Step 1: Choose Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map(course => (
              <button
                key={course._id}
                onClick={() => handleCourseSelect(course._id)}
                className={`p-4 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCourse === course._id
                    ? 'bg-blue-600 text-white scale-105'
                    : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
                }`}
              >
                {course.name}
              </button>
            ))}
          </div>
        </div>

        {/* Branches */}
        {selectedCourse && branches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Step 2: Choose Branch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {branches.map(branch => (
                <button
                  key={branch._id}
                  onClick={() => handleBranchSelect(branch._id)}
                  className={`p-4 rounded-lg font-semibold transition-all duration-300 ${
                    selectedBranch === branch._id
                      ? 'bg-green-600 text-white scale-105'
                      : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
                  }`}
                >
                  {branch.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Semesters */}
        {selectedBranch && semesters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Step 3: Choose Semester</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {semesters.map(semester => (
                <button
                  key={semester._id}
                  onClick={() => handleSemesterSelect(semester._id)}
                  className={`p-4 rounded-lg font-semibold transition-all duration-300 ${
                    selectedSemester === semester._id
                      ? 'bg-purple-600 text-white scale-105'
                      : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
                  }`}
                >
                  Sem {semester.number}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Proceed Button */}
        {selectedSemester && (
          <div className="text-center mt-12">
            <button
              onClick={handleProceed}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              View Subjects
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
