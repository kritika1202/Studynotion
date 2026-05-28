require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Course = require("../models/Course");

const instructors = [
  { name: "Priya Sharma", email: "priya@studynotion.dev", password: "password123", role: "instructor" },
  { name: "Arjun Mehta", email: "arjun@studynotion.dev", password: "password123", role: "instructor" },
  { name: "Kavita Singh", email: "kavita@studynotion.dev", password: "password123", role: "instructor" },
];

const makeLectures = (titles) =>
  titles.map((title, i) => ({
    title,
    duration: 8 + Math.floor(Math.random() * 22),
    isFree: i === 0,
  }));

const courseSeed = (instructorId) => [
  {
    title: "The Complete React Developer — Hooks, Redux & Projects",
    slug: "complete-react-developer",
    description:
      "Master React 18 from scratch. Build production-ready apps using hooks, context, Redux Toolkit, React Router, and Tailwind CSS. Includes 5 real-world projects.",
    category: "Web Development",
    level: "Intermediate",
    price: 1499,
    isFeatured: true,
    rating: 4.8,
    totalStudents: 12430,
    instructor: instructorId,
    tags: ["react", "redux", "hooks", "javascript"],
    sections: [
      {
        title: "Getting Started with React",
        lectures: makeLectures(["Why React?", "Setting Up Your Environment", "JSX Deep Dive", "Component Thinking"]),
      },
      {
        title: "Hooks in Depth",
        lectures: makeLectures(["useState & useEffect", "useRef and useMemo", "Custom Hooks", "Rules of Hooks"]),
      },
      {
        title: "State Management with Redux Toolkit",
        lectures: makeLectures(["Redux Core Concepts", "createSlice", "Async Thunks", "RTK Query Intro"]),
      },
      {
        title: "Capstone Project",
        lectures: makeLectures(["Project Setup", "Building the API Layer", "Connecting Redux", "Deploying to Vercel"]),
      },
    ],
  },
  {
    title: "Node.js & Express — REST APIs from Zero to Production",
    slug: "nodejs-express-rest-apis",
    description:
      "Build scalable REST APIs with Node.js, Express, MongoDB, and JWT authentication. Learn error handling, middleware, rate limiting, and deployment.",
    category: "Web Development",
    level: "Intermediate",
    price: 1299,
    isFeatured: true,
    rating: 4.7,
    totalStudents: 8920,
    instructor: instructorId,
    tags: ["nodejs", "express", "mongodb", "api"],
    sections: [
      {
        title: "Node.js Fundamentals",
        lectures: makeLectures(["Event Loop Explained", "Modules & CommonJS", "File System API", "Streams & Buffers"]),
      },
      {
        title: "Building with Express",
        lectures: makeLectures(["Routing Deep Dive", "Middleware Pipeline", "Error Handling", "Validation with Joi"]),
      },
      {
        title: "MongoDB & Mongoose",
        lectures: makeLectures(["Schema Design", "CRUD Operations", "Aggregation Pipeline", "Indexing for Performance"]),
      },
    ],
  },
  {
    title: "Python for Data Science — NumPy, Pandas & Matplotlib",
    slug: "python-data-science",
    description:
      "Hands-on data science with Python. Covers NumPy arrays, Pandas DataFrames, data cleaning, exploratory analysis, and visualization with Matplotlib and Seaborn.",
    category: "Data Science",
    level: "Beginner",
    price: 999,
    isFeatured: true,
    rating: 4.9,
    totalStudents: 21000,
    instructor: instructorId,
    tags: ["python", "pandas", "numpy", "data science"],
    sections: [
      {
        title: "Python Refresher",
        lectures: makeLectures(["Lists & Dicts", "List Comprehensions", "Functions & Lambdas", "File I/O"]),
      },
      {
        title: "NumPy for Numerical Computing",
        lectures: makeLectures(["ndarray Basics", "Indexing & Slicing", "Broadcasting", "Linear Algebra"]),
      },
      {
        title: "Data Wrangling with Pandas",
        lectures: makeLectures(["Series & DataFrames", "GroupBy & Aggregation", "Merge & Join", "Handling Missing Data"]),
      },
      {
        title: "Visualisation",
        lectures: makeLectures(["Matplotlib Plots", "Seaborn Statistical Plots", "Interactive Charts"]),
      },
    ],
  },
  {
    title: "Docker & Kubernetes — From Development to Production",
    slug: "docker-kubernetes-production",
    description:
      "Containerize applications with Docker and orchestrate them at scale with Kubernetes. Covers Docker Compose, Helm charts, CI/CD pipelines, and GKE deployment.",
    category: "DevOps",
    level: "Advanced",
    price: 1799,
    isFeatured: false,
    rating: 4.6,
    totalStudents: 5400,
    instructor: instructorId,
    tags: ["docker", "kubernetes", "devops", "cloud"],
    sections: [
      {
        title: "Docker Essentials",
        lectures: makeLectures(["Images vs Containers", "Writing Dockerfiles", "Multi-Stage Builds", "Docker Compose"]),
      },
      {
        title: "Kubernetes Fundamentals",
        lectures: makeLectures(["Pods & Deployments", "Services & Ingress", "ConfigMaps & Secrets", "StatefulSets"]),
      },
      {
        title: "Production Best Practices",
        lectures: makeLectures(["Resource Limits", "Health Probes", "Horizontal Pod Autoscaler", "Helm Charts"]),
      },
    ],
  },
  {
    title: "UI/UX Design Fundamentals — Figma & Design Systems",
    slug: "uiux-design-figma",
    description:
      "Learn design thinking, wireframing, prototyping, and design system creation using Figma. Perfect for developers who want to build beautiful, user-centered interfaces.",
    category: "Design",
    level: "Beginner",
    price: 0,
    isFeatured: true,
    rating: 4.7,
    totalStudents: 18600,
    instructor: instructorId,
    tags: ["figma", "ui", "ux", "design system"],
    sections: [
      {
        title: "Design Thinking",
        lectures: makeLectures(["User Research", "Personas & Journeys", "Problem Framing"]),
      },
      {
        title: "Figma Essentials",
        lectures: makeLectures(["Frames & Auto Layout", "Components & Variants", "Prototyping Interactions"]),
      },
      {
        title: "Building a Design System",
        lectures: makeLectures(["Color Tokens", "Typography Scale", "Component Library", "Handoff to Developers"]),
      },
    ],
  },
  {
    title: "Full-Stack Flutter — Cross-Platform Apps with Firebase",
    slug: "flutter-firebase-fullstack",
    description:
      "Build native iOS and Android apps with Flutter and Dart. Integrate Firebase Authentication, Firestore, Cloud Storage, and deploy to the App Store and Play Store.",
    category: "Mobile Development",
    level: "Intermediate",
    price: 1599,
    isFeatured: true,
    rating: 4.5,
    totalStudents: 7200,
    instructor: instructorId,
    tags: ["flutter", "dart", "firebase", "mobile"],
    sections: [
      {
        title: "Dart Fundamentals",
        lectures: makeLectures(["Variables & Types", "OOP in Dart", "Async/Await & Futures"]),
      },
      {
        title: "Flutter Widgets",
        lectures: makeLectures(["Stateless vs Stateful", "Layout Widgets", "Navigation & Routing"]),
      },
      {
        title: "Firebase Integration",
        lectures: makeLectures(["Firebase Auth", "Firestore CRUD", "Cloud Functions", "Push Notifications"]),
      },
    ],
  },
];

async function seed() {
  await connectDB();
  await Course.deleteMany({});
  await User.deleteMany({ role: { $in: ["instructor", "admin"] } });

  const created = await User.insertMany(instructors);
  const instructor = created[0];

  const courses = courseSeed(instructor._id);
  await Course.insertMany(courses);

  console.log(`✅ Seeded ${courses.length} courses with instructor: ${instructor.email}`);
  console.log("   Demo student: use /api/auth/register to create one");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
