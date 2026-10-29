import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Subject from "../models/Subject.js";
import Material from "../models/Material.js";

const subjectsData = [
  // Semester 1
  {
    code: "BT-101",
    name: "Engineering Chemistry",
    semester: 1,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Water – Analysis, Treatments and Industrial Applications", topics: "Sources, Hardness determination (EDTA), Boiler troubles, Lime-Soda & Zeolite softening" },
      { id: "u2", number: "UNIT II", name: "Fuels and Combustion", topics: "Fossil fuels, Higher/Lower calorific values, Bomb calorimeter, Proximate & Ultimate coal analysis" },
      { id: "u3", number: "UNIT III", name: "Lubricants and Polymerization", topics: "Lubrication mechanisms, Viscosity index, Thermosetting & Thermoplastics, Elastomers" },
      { id: "u4", number: "UNIT IV", name: "Phase Equilibrium and Corrosion", topics: "Gibb's phase rule, Water system, Chemical/electrochemical corrosion mechanisms & prevention" },
      { id: "u5", number: "UNIT V", name: "Spectroscopic Techniques and Periodic Properties", topics: "UV-Visible & IR spectroscopy principles, Slater's rules, Periodic orbital energy trends" },
    ],
  },
  {
    code: "BT-102",
    name: "Mathematics - I",
    semester: 1,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Calculus - I", topics: "Rolle’s & Mean Value theorems, Taylor’s & Maclaurin's expansions, Maxima and Minima" },
      { id: "u2", number: "UNIT II", name: "Calculus - II", topics: "Definite integrals, Beta & Gamma functions, Multiple double/triple integrals & area/volume" },
      { id: "u3", number: "UNIT III", name: "Sequences and Series", topics: "Convergence tests, Power series, Fourier series half-range sine/cosine & Parseval's theorem" },
      { id: "u4", number: "UNIT IV", name: "Vector Spaces", topics: "Vector space & subspaces, Linear independence, Basis and Dimension, Linear transformations" },
      { id: "u5", number: "UNIT V", name: "Matrices", topics: "Rank of matrix, Elementary transformations, System of linear equations, Eigenvalues & Eigenvectors" },
    ],
  },
  {
    code: "BT-103",
    name: "English for Communication",
    semester: 1,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Communication & Language Skills", topics: "Communication process, Barriers, Verbal & non-verbal communication, Active listening" },
      { id: "u2", number: "UNIT II", name: "Vocabulary & Grammar Usage", topics: "Word formation, Synonyms/antonyms, Common errors in English, Concord & Prepositions" },
      { id: "u3", number: "UNIT III", name: "Technical Writing & Composition", topics: "Formal letter writing, Resume & CV preparation, Technical reports & Executive summaries" },
      { id: "u4", number: "UNIT IV", name: "Reading Comprehension & Analysis", topics: "Techniques for effective reading, Skimming, Scanning, Critical analysis of technical texts" },
      { id: "u5", number: "UNIT V", name: "Listening & Presentation Skills", topics: "Listening types, Barriers to listening, Professional presentations, Group discussions" },
    ],
  },
  {
    code: "BT-104",
    name: "Basic Electrical & Electronics Engineering",
    semester: 1,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "D.C. Circuits & Network Theorems", topics: "Kirchhoff’s laws (KCL/KVL), Mesh and Nodal analysis, Thevenin's, Norton's & Superposition theorems" },
      { id: "u2", number: "UNIT II", name: "1-Phase & 3-Phase A.C. Circuits", topics: "RMS and average values, Form factor, Series/parallel RLC circuits, Resonance, 3-Phase balanced circuits" },
      { id: "u3", number: "UNIT III", name: "Magnetic Circuits & Transformers", topics: "B-H curve, Magnetic circuits, Single-phase transformers EMF equation, Equivalent circuit & Losses" },
      { id: "u4", number: "UNIT IV", name: "Electrical Machines", topics: "Construction & working principles of DC machines, 3-Phase induction motors & Synchronous generators" },
      { id: "u5", number: "UNIT V", name: "Semiconductor Diodes & Transistors", topics: "PN junction diode, V-I characteristics, Rectifiers, Zener diode, BJT configurations & Biasing" },
    ],
  },
  {
    code: "BT-105",
    name: "Engineering Graphics",
    semester: 1,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Introduction to Engineering Drawing & Scales", topics: "Drawing instruments, Lettering & dimensioning, Representative fraction (RF), Plain & Diagonal scales" },
      { id: "u2", number: "UNIT II", name: "Engineering Curves & Conic Sections", topics: "Ellipse, Parabola, Hyperbola, Cycloid, Epicycloid, Involutes and Spirals" },
      { id: "u3", number: "UNIT III", name: "Projections of Points, Lines & Planes", topics: "1st & 3rd angle projection, True length & inclinations, Traces of lines, Projections of planes" },
      { id: "u4", number: "UNIT IV", name: "Projections & Sections of Solids", topics: "Prisms, Pyramids, Cylinders and Cones axis inclined, Section planes & true shapes of sections" },
      { id: "u5", number: "UNIT V", name: "Isometric Projections & CAD Basics", topics: "Isometric scale and views of planar & solid shapes, Introduction to CAD software commands" },
    ],
  },

  // Semester 2
  {
    code: "BT-201",
    name: "Engineering Physics",
    semester: 2,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Wave Nature of Particles & Quantum Mechanics", topics: "De-Broglie waves, Wave-particle duality, Heisenberg uncertainty principle, Schrödinger wave equation" },
      { id: "u2", number: "UNIT II", name: "Wave Optics", topics: "Interference in thin films, Newton's rings, Fraunhofer diffraction through single slit & Diffraction grating" },
      { id: "u3", number: "UNIT III", name: "Solid State Physics & Semiconductors", topics: "Kronig-Penney model, Energy band diagram, Intrinsic and Extrinsic semiconductors, Hall effect" },
      { id: "u4", number: "UNIT IV", name: "Lasers & Fiber Optics", topics: "Stimulated emission, Population inversion, Ruby & He-Ne lasers, Optical fiber numerical aperture" },
      { id: "u5", number: "UNIT V", name: "Electromagnetism & Dielectrics", topics: "Maxwell's equations, Electromagnetic wave propagation in free space, Dielectric polarization" },
    ],
  },
  {
    code: "BT-202",
    name: "Mathematics - II",
    semester: 2,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "First Order Ordinary Differential Equations", topics: "Exact equations, Integrating factors, Linear differential equations, Bernoulli's equation, Applications" },
      { id: "u2", number: "UNIT II", name: "Linear Differential Equations of Higher Order", topics: "Higher order linear ODEs with constant coefficients, Method of variation of parameters, Cauchy-Euler" },
      { id: "u3", number: "UNIT III", name: "Second Order ODEs & Series Solutions", topics: "Second order linear differential equations with variable coefficients, Frobenius method, Bessel functions" },
      { id: "u4", number: "UNIT IV", name: "Partial Differential Equations", topics: "First order partial differential equations, Lagrange's linear equation, Charpit’s method, Wave equation" },
      { id: "u5", number: "UNIT V", name: "Vector Calculus", topics: "Gradient, Divergence and Curl, Line/Surface/Volume integrals, Green's, Gauss and Stokes' theorems" },
    ],
  },

  // Semester 3
  {
    code: "CS-303",
    name: "Data Structure",
    semester: 3,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Data Structures Overview & Linked Lists", topics: "Abstract Data Types (ADT), Arrays representation, Singly, Doubly, and Circular linked lists & applications" },
      { id: "u2", number: "UNIT II", name: "Stacks and Queues", topics: "Stack ADT, Infix to postfix conversion, Evaluation of postfix expressions, Circular queues, Deque & Priority queues" },
      { id: "u3", number: "UNIT III", name: "Trees & Binary Search Trees", topics: "Tree traversals (Inorder, Preorder, Postorder), Binary Search Tree (BST), AVL trees, Heaps, B-Trees & B+ trees" },
      { id: "u4", number: "UNIT IV", name: "Graphs & Sorting Algorithms", topics: "Graph representation, BFS, DFS, Dijkstra’s algorithm, Prim’s & Kruskal's MST, Quick sort, Merge sort, Heap sort" },
      { id: "u5", number: "UNIT V", name: "Hashing & File Structures", topics: "Hash functions, Collision resolution techniques, Linear probing, Quadratic probing, Chaining, File indexing" },
    ],
  },

  // Semester 4
  {
    code: "CS-405",
    name: "Operating Systems",
    semester: 4,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Operating Systems Overview & Services", topics: "Evolution and types of OS, OS structures, System calls & System programs, Virtual machines" },
      { id: "u2", number: "UNIT II", name: "Process Management & CPU Scheduling", topics: "Process concepts, PCB, Threads, Process scheduling, FCFS, SJF, Round Robin, Priority, Multilevel queue" },
      { id: "u3", number: "UNIT III", name: "Process Synchronization & Deadlocks", topics: "Critical section problem, Peterson’s solution, Semaphores, Deadlock prevention, Banker’s algorithm" },
      { id: "u4", number: "UNIT IV", name: "Memory Management & Virtual Memory", topics: "Paging, Segmentation, Swapping, Demand paging, Page replacement algorithms (FIFO, LRU, Optimal)" },
      { id: "u5", number: "UNIT V", name: "File Systems & Disk Scheduling", topics: "File attributes & access methods, Directory structures, Allocation methods, Disk scheduling (FCFS, SSTF, SCAN)" },
    ],
  },

  // Semester 5
  {
    code: "CS-502",
    name: "Database Management Systems",
    semester: 5,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Introduction to DBMS & Relational Model", topics: "Database architecture, Data models, ER diagrams, Relational model concepts, Relational algebra" },
      { id: "u2", number: "UNIT II", name: "SQL & Relational Database Design", topics: "SQL DDL, DML, DCL, Aggregate functions, Nested subqueries, Joins, Views, Triggers, Assertions" },
      { id: "u3", number: "UNIT III", name: "Normalization & Functional Dependencies", topics: "Pitfalls in relational design, Functional dependencies, 1NF, 2NF, 3NF, BCNF, Multi-valued dependencies (4NF)" },
      { id: "u4", number: "UNIT IV", name: "Transaction Processing & Concurrency Control", topics: "ACID properties, Serializability, Two-phase locking (2PL), Deadlock handling, Timestamp ordering" },
      { id: "u5", number: "UNIT V", name: "Recovery Systems & Storage Architecture", topics: "Failure classification, Log-based recovery, Checkpoints, ARIES, RAID levels, Indexing (B+ trees)" },
    ],
  },
];

export const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notes_db";
    await mongoose.connect(mongoURI);
    console.log("[Seed] Connected to MongoDB");

    for (const sub of subjectsData) {
      await Subject.findOneAndUpdate(
        { code: sub.code },
        sub,
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Successfully seeded ${subjectsData.length} core subjects and units.`);

    // Check if sample material exists, if not create sample handwritten notes & PYQs
    const sampleMaterialCount = await Material.countDocuments();
    if (sampleMaterialCount === 0) {
      const sampleMaterials = [
        {
          title: "Engineering Chemistry: Water Analysis & Treatment Hand-Written Notes",
          resourceType: "handwritten-notes",
          subjectCode: "BT-101",
          unitNumber: "UNIT I",
          unitId: "u1",
          semester: 1,
          branch: "CSE",
          description: "Clear handwritten notes covering EDTA method, boiler troubles, and water softening.",
          author: "Topper Student (Govt. Engineering College)",
          file: {
            fileId: "sample_bt101_u1",
            url: "https://ik.imagekit.io/eduvault_demo/sample_chem_unit1.pdf",
            thumbnailUrl: "https://ik.imagekit.io/eduvault_demo/sample_chem_unit1.pdf/ik-thumbnail.jpg",
            fileName: "BT101_Unit1_Chemistry_Notes.pdf",
            fileType: "pdf",
            sizeBytes: 4200000,
            pagesCount: 24,
          },
        },
        {
          title: "Engineering Chemistry: RGPV 2023 Dec End-Semester Question Paper",
          resourceType: "pyq",
          subjectCode: "BT-101",
          semester: 1,
          branch: "CSE",
          year: "2023",
          description: "Official RGPV December 2023 semester examination question paper with solution keys.",
          author: "RGPV University",
          file: {
            fileId: "sample_bt101_pyq_2023",
            url: "https://ik.imagekit.io/eduvault_demo/sample_chem_pyq2023.pdf",
            thumbnailUrl: "https://ik.imagekit.io/eduvault_demo/sample_chem_pyq2023.pdf/ik-thumbnail.jpg",
            fileName: "BT101_PYQ_Dec2023.pdf",
            fileType: "pdf",
            sizeBytes: 1850000,
            pagesCount: 6,
          },
        },
        {
          title: "Data Structures: Trees, BST & AVL Trees Complete Handwritten Notes",
          resourceType: "handwritten-notes",
          subjectCode: "CS-303",
          unitNumber: "UNIT III",
          unitId: "u3",
          semester: 3,
          branch: "CSE",
          description: "Comprehensive handwritten diagrams and algorithm walkthroughs for Binary Trees & AVL balance factors.",
          author: "CSE Faculty",
          file: {
            fileId: "sample_cs303_u3",
            url: "https://ik.imagekit.io/eduvault_demo/sample_dsa_trees.pdf",
            thumbnailUrl: "https://ik.imagekit.io/eduvault_demo/sample_dsa_trees.pdf/ik-thumbnail.jpg",
            fileName: "CS303_Unit3_Trees_Notes.pdf",
            fileType: "pdf",
            sizeBytes: 5600000,
            pagesCount: 32,
          },
        },
      ];

      await Material.insertMany(sampleMaterials);
      console.log(`[Seed] Inserted ${sampleMaterials.length} sample study materials with ImageKit CDN links.`);
    }

    console.log("[Seed] Seeding completed!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("[Seed Error]", error);
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith("seedCurriculum.js")) {
  seedDatabase();
}
