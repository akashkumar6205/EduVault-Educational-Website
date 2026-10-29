import Subject from "../models/Subject.js";

// Static definitions matching frontend structure with dynamic subjects from MongoDB
const UNIVERSITIES = [
  {
    id: "rgpv",
    code: "RGPV",
    name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
    isAvailable: true,
    city: "Bhopal",
  },
];

const COURSES = [
  {
    id: "btech",
    code: "B.Tech",
    name: "Bachelor of Technology",
    duration: "4 Years · 8 Semesters",
    isAvailable: true,
  },
];

const BRANCHES = [
  {
    id: "cse",
    code: "CSE",
    name: "Computer Science & Engineering",
    isAvailable: true,
  },
  {
    id: "it",
    code: "IT",
    name: "Information Technology",
    isAvailable: false,
  },
  {
    id: "ece",
    code: "ECE",
    name: "Electronics & Communication Engineering",
    isAvailable: false,
  },
];

export const getUniversities = (req, res) => {
  res.status(200).json({ success: true, data: UNIVERSITIES });
};

export const getCourses = (req, res) => {
  res.status(200).json({ success: true, data: COURSES });
};

export const getBranches = (req, res) => {
  res.status(200).json({ success: true, data: BRANCHES });
};

export const getSubjects = async (req, res, next) => {
  try {
    const { semester, branch = "CSE", course = "B.Tech", search } = req.query;

    const query = {
      branch: new RegExp(`^${branch}$`, "i"),
    };

    if (semester) {
      query.semester = Number(semester);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    const subjects = await Subject.find(query).sort({ semester: 1, code: 1 });

    return res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubjectByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const subject = await Subject.findOne({ code: code.toUpperCase() });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: `Subject with code ${code} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};
