import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend/.env regardless of execution directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import Subject from "../models/Subject.js";
import Material from "../models/Material.js";

// Complete RGPV B.Tech CSE Curriculum (Semesters 1 through 8, 32 subjects)
export const allSubjectsData = [
  // ─── Semester 1 ───
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

  // ─── Semester 2 ───
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
  {
    code: "BT-203",
    name: "Basic Mechanical Engineering",
    semester: 2,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Materials & Engineering Mechanics", topics: "Classification of engineering materials, Stress-strain diagrams, Laws of mechanics, Lami's theorem" },
      { id: "u2", number: "UNIT II", name: "Thermodynamics & Steam Properties", topics: "Zeroth, 1st and 2nd laws of thermodynamics, Carnot cycle, Steam properties, Steam boilers & mountings" },
      { id: "u3", number: "UNIT III", name: "Internal Combustion Engines", topics: "Working of 2-stroke and 4-stroke petrol & diesel engines, Otto & Diesel cycles, Basic refrigeration" },
      { id: "u4", number: "UNIT IV", name: "Fluids & Hydraulic Machines", topics: "Pascal’s law, Bernoulli’s theorem, Pumps, Pelton wheel, Francis and Kaplan hydraulic turbines" },
      { id: "u5", number: "UNIT V", name: "Manufacturing Processes", topics: "Pattern making, Casting processes, Welding techniques (Arc & Gas), Lathe & Drilling machine tools" },
    ],
  },
  {
    code: "BT-204",
    name: "Basic Civil Engineering & Mechanics",
    semester: 2,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Building Materials & Construction", topics: "Properties of stones, Bricks, Cement, Mortar, Concrete, Types of foundations, Brick masonry" },
      { id: "u2", number: "UNIT II", name: "Surveying & Levelling", topics: "Principles of surveying, Chain surveying, Compass surveying, Ranging, Levelling and contouring" },
      { id: "u3", number: "UNIT III", name: "Coplanar Force Systems & Equilibrium", topics: "Force systems, Resolution and composition of forces, Moment of force, Varignon's theorem, Equilibrium" },
      { id: "u4", number: "UNIT IV", name: "Beams, Trusses & Friction", topics: "Types of beams and supports, Shear force & Bending moment diagrams (SFD/BMD), Analysis of plane trusses" },
      { id: "u5", number: "UNIT V", name: "Centroid & Moment of Inertia", topics: "Centroid of composite figures, Area moment of inertia, Parallel and Perpendicular axis theorems" },
    ],
  },
  {
    code: "BT-205",
    name: "Basic Computer Engineering",
    semester: 2,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Computer Hardware & Operating Systems", topics: "Computer architecture block diagram, Primary & secondary storage, OS functions, DOS & Linux commands" },
      { id: "u2", number: "UNIT II", name: "Number Systems & Digital Logic", topics: "Binary, Octal, Hexadecimal conversions, 1's & 2's complements, Logic gates, Boolean laws, De Morgan's" },
      { id: "u3", number: "UNIT III", name: "Object Oriented Programming (C++)", topics: "OOP concepts, Classes and objects, Data types, Control structures, Functions, Constructors, Destructors" },
      { id: "u4", number: "UNIT IV", name: "Inheritance, Polymorphism & Pointers", topics: "Single, Multiple & Multilevel inheritance, Function overloading, Operator overloading, Pointers" },
      { id: "u5", number: "UNIT V", name: "Data Structures & Computer Networks", topics: "Arrays, Stacks, Queues, Linked lists basics, LAN, MAN, WAN, OSI model layers, Internet fundamentals" },
    ],
  },

  // ─── Semester 3 ───
  {
    code: "ES-301",
    name: "Energy & Environmental Engineering",
    semester: 3,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Energy Resources & Conventional Power", topics: "Global energy scenario, Fossil fuel reserves, Thermal, Hydro, and Nuclear power generation systems" },
      { id: "u2", number: "UNIT II", name: "Renewable Energy Sources", topics: "Solar PV and thermal systems, Wind energy conversion, Biomass, Geothermal & Ocean energy technologies" },
      { id: "u3", number: "UNIT III", name: "Ecosystems and Biodiversity", topics: "Ecosystem structure & function, Food chains, Food webs, Biodiversity values, Threats & in-situ/ex-situ conservation" },
      { id: "u4", number: "UNIT IV", name: "Environmental Pollution and Control", topics: "Air, Water, Soil, Noise and Marine pollution causes, Effects and abatement technologies, Solid waste management" },
      { id: "u5", number: "UNIT V", name: "EIA and Sustainable Development", topics: "Environmental Impact Assessment methodology, Carbon credits, Kyoto protocol, Green building standards" },
    ],
  },
  {
    code: "CS-302",
    name: "Discrete Structure",
    semester: 3,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Set Theory, Relations & Functions", topics: "Set identities, Countability, Equivalence relations, Partial ordering, Inverse & recursively defined functions" },
      { id: "u2", number: "UNIT II", name: "Algebraic Structures", topics: "Semigroups, Monoids, Groups, Subgroups, Cyclic groups, Cosets, Lagrange’s theorem, Homomorphism, Rings" },
      { id: "u3", number: "UNIT III", name: "Propositional Logic & Finite Automata", topics: "Propositions, Logical equivalences, Normal forms (CNF/DNF), Quantifiers, Finite State Machines introduction" },
      { id: "u4", number: "UNIT IV", name: "Graph Theory", topics: "Planar & weighted graphs, Paths & cycles, Eulerian & Hamiltonian circuits, Graph coloring, Chromatic numbers" },
      { id: "u5", number: "UNIT V", name: "Posets, Lattices & Combinatorics", topics: "Hasse diagrams, Lattices properties, Permutations & Combinations, Linear recurrence relations, Generating functions" },
    ],
  },
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
  {
    code: "CS-304",
    name: "Digital Systems",
    semester: 3,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Number Systems & Boolean Algebra", topics: "Binary arithmetic, BCD, Gray codes, Boolean minimization, Karnaugh Maps (K-Map), Quine-McCluskey method" },
      { id: "u2", number: "UNIT II", name: "Combinational Logic Circuits", topics: "Half & Full Adders, Subtractors, Encoders, Decoders, Multiplexers, Demultiplexers, Parity generators" },
      { id: "u3", number: "UNIT III", name: "Sequential Logic Circuits", topics: "SR, JK, D, and T flip-flops, Master-slave flip-flops, Shift registers, Synchronous & Asynchronous counters" },
      { id: "u4", number: "UNIT IV", name: "Semiconductor Memories & PLDs", topics: "RAM, ROM, PROM, EPROM, Programmable Logic Arrays (PLA), Programmable Array Logic (PAL), FPGA architecture" },
      { id: "u5", number: "UNIT V", name: "Logic Families & Converters", topics: "TTL, ECL, and CMOS characteristics, D/A converters (R-2R ladder), A/D converters (Flash, Successive approx)" },
    ],
  },
  {
    code: "CS-305",
    name: "Object Oriented Programming & Methodology",
    semester: 3,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Object Oriented Methodology & C++ Basics", topics: "Object-oriented paradigm vs structured, C++ tokens, Control structures, Inline functions, References" },
      { id: "u2", number: "UNIT II", name: "Classes, Objects & Constructors", topics: "Class specification, Data hiding, Static members, Parameterized constructors, Copy constructors, Destructors" },
      { id: "u3", number: "UNIT III", name: "Inheritance & Function Overloading", topics: "Derived classes, Access specifiers, Multiple & hierarchical inheritance, Function and operator overloading" },
      { id: "u4", number: "UNIT IV", name: "Polymorphism, Virtual Functions & Templates", topics: "Early vs late binding, Pure virtual functions, Abstract classes, Virtual base classes, Function & class templates" },
      { id: "u5", number: "UNIT V", name: "Exception Handling & File Streams", topics: "Try, catch, throw mechanisms, Custom exceptions, File stream classes, Sequential and random access file I/O" },
    ],
  },

  // ─── Semester 4 ───
  {
    code: "BT-401",
    name: "Mathematics - III",
    semester: 4,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Numerical Solutions of Algebraic Equations", topics: "Bisection method, Regula-Falsi method, Newton-Raphson method, Convergence criteria, System of linear equations" },
      { id: "u2", number: "UNIT II", name: "Interpolation & Approximation", topics: "Finite differences, Newton's forward and backward formulas, Gauss central difference, Lagrange’s interpolation" },
      { id: "u3", number: "UNIT III", name: "Numerical Differentiation & Integration", topics: "Numerical differentiation, Trapezoidal rule, Simpson’s 1/3 and 3/8 rules, Euler's and Runge-Kutta 4th order ODEs" },
      { id: "u4", number: "UNIT IV", name: "Transform Calculus", topics: "Laplace transforms, Inverse Laplace transforms, Convolution theorem, Fourier transforms and properties" },
      { id: "u5", number: "UNIT V", name: "Probability & Statistics", topics: "Discrete and continuous random variables, Binomial, Poisson, and Normal distributions, Sampling & hypothesis testing" },
    ],
  },
  {
    code: "CS-402",
    name: "Analysis & Design of Algorithm",
    semester: 4,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Algorithms & Divide and Conquer", topics: "Time and space complexity, Asymptotic notations (O, Ω, Θ), Master theorem, Binary search, Merge sort, Quick sort" },
      { id: "u2", number: "UNIT II", name: "Greedy Strategy", topics: "Knapsack problem, Job sequencing with deadlines, Optimal merge patterns, Prim's and Kruskal's MST, Dijkstra algorithm" },
      { id: "u3", number: "UNIT III", name: "Dynamic Programming", topics: "0/1 Knapsack, All-pairs shortest paths (Floyd-Warshall), Multistage graphs, Matrix chain multiplication, Bellman-Ford" },
      { id: "u4", number: "UNIT IV", name: "Backtracking & Branch and Bound", topics: "8-Queens problem, Hamiltonian cycles, Graph coloring, Traveling salesperson problem (TSP), 15-puzzle problem" },
      { id: "u5", number: "UNIT V", name: "NP-Hard and NP-Complete Problems", topics: "Deterministic vs non-deterministic algorithms, P, NP, NP-Hard, and NP-Complete classes, Cook’s theorem, Approximation" },
    ],
  },
  {
    code: "CS-403",
    name: "Software Engineering",
    semester: 4,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Software Development Life Cycle & Models", topics: "Software engineering phases, Waterfall, Spiral, V-model, Prototyping, Agile framework, Scrum methodology" },
      { id: "u2", number: "UNIT II", name: "Software Requirements Engineering", topics: "Requirement elicitation, Functional & non-functional requirements, SRS document structure, Feasibility studies" },
      { id: "u3", number: "UNIT III", name: "Software Design & Architecture", topics: "Cohesion and Coupling, Architectural design styles, Modular decomposition, Function-oriented design, UML diagrams" },
      { id: "u4", number: "UNIT IV", name: "Software Testing & Quality Assurance", topics: "White-box testing (Basis path, Cyclomatic complexity), Black-box testing (Equivalence partitioning, BVA), SQA" },
      { id: "u5", number: "UNIT V", name: "Software Project Management", topics: "Project estimation (COCOMO model), Risk management, Software maintenance, Configuration management (SCM)" },
    ],
  },
  {
    code: "CS-404",
    name: "Computer Organization & Architecture",
    semester: 4,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Computer Architecture & Machine Instructions", topics: "Von Neumann architecture, Register transfer language, Bus architecture, Instruction cycles and addressing modes" },
      { id: "u2", number: "UNIT II", name: "Central Processing Unit & Arithmetic", topics: "Hardwired vs microprogrammed control unit, Fixed-point and floating-point arithmetic, Booth’s multiplication algorithm" },
      { id: "u3", number: "UNIT III", name: "Memory Organization", topics: "Memory hierarchy, Cache memory mapping techniques, Hit ratio, Replacement algorithms, Virtual memory & Paging" },
      { id: "u4", number: "UNIT IV", name: "Input-Output Organization", topics: "Peripheral devices, Programmed I/O, Interrupt-driven I/O, Direct Memory Access (DMA) transfer & IOP processor" },
      { id: "u5", number: "UNIT V", name: "Pipelining & Parallel Processors", topics: "Instruction pipelining, Pipeline hazards, Arithmetic pipeline, Vector processing, Superscalar & Multiprocessor structures" },
    ],
  },
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

  // ─── Semester 5 ───
  {
    code: "CS-501",
    name: "Theory of Computation",
    semester: 5,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Introduction to Automata Theory", topics: "Automata machines, Finite automata as acceptors/translators, Moore and Mealy machines & mutual conversion" },
      { id: "u2", number: "UNIT II", name: "Finite Automata & Regular Expressions", topics: "Deterministic & Non-deterministic FA (DFA/NFA), NFA to DFA conversion, Minimization, Arden's theorem, Regular sets" },
      { id: "u3", number: "UNIT III", name: "Chomsky Hierarchy & Grammars", topics: "Grammar types, Context-Free Grammar (CFG), Derivation trees, Ambiguity, Simplification, Normal forms (CNF & GNF)" },
      { id: "u4", number: "UNIT IV", name: "Pushdown Automata (PDA)", topics: "PDA formal definition, Acceptance by final state & empty stack, Equivalence of PDA and CFG, Deterministic PDA" },
      { id: "u5", number: "UNIT V", name: "Turing Machines & Computability", topics: "Turing Machine construction, Universal TM, Decidability, Halting problem, Post Correspondence Problem (PCP)" },
    ],
  },
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
  {
    code: "CS-503",
    name: "Data Analytics",
    semester: 5,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Data Analytics Foundations", topics: "Data analytics lifecycle, Structured vs unstructured data, Exploratory data analysis (EDA), Summary statistics" },
      { id: "u2", number: "UNIT II", name: "Data Preprocessing & Cleaning", topics: "Missing value imputation, Outlier detection, Feature scaling, Normalization, Dimensionality reduction (PCA)" },
      { id: "u3", number: "UNIT III", name: "Statistical Modeling & Regression", topics: "Simple & multiple linear regression, Logistic regression, Model diagnostics, Confidence intervals & Residual analysis" },
      { id: "u4", number: "UNIT IV", name: "Classification & Clustering", topics: "Decision trees, K-Nearest Neighbors (KNN), K-Means clustering, Hierarchical clustering & Evaluation metrics" },
      { id: "u5", number: "UNIT V", name: "Big Data Analytics Tools & Visualization", topics: "R and Python data science ecosystems, Tableau/PowerBI dashboards, Ethics in data analytics & Case studies" },
    ],
  },
  {
    code: "CS-504",
    name: "Internet & Web Technology",
    semester: 5,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Web Fundamentals & Client Technologies", topics: "Internet protocols (HTTP/HTTPS, DNS), Web browsers architecture, HTML5 semantic elements & Responsive CSS3" },
      { id: "u2", number: "UNIT II", name: "JavaScript & DOM Scripting", topics: "Modern ES6+ syntax, DOM manipulation, Event-driven programming, Form validation, Promises and Async/Await" },
      { id: "u3", number: "UNIT III", name: "Server-Side Programming", topics: "Server architectures, Node.js runtime, Express framework, Request handling, Middleware & RESTful API development" },
      { id: "u4", number: "UNIT IV", name: "Database Integration & Security", topics: "Database connectivity (MongoDB/MySQL), User authentication (JWT, OAuth), CORS, XSS and CSRF prevention" },
      { id: "u5", number: "UNIT V", name: "Web Services & Modern Deployment", topics: "JSON/XML web services, WebSockets real-time communication, CI/CD pipelines and Cloud hosting deployment" },
    ],
  },

  // ─── Semester 6 ───
  {
    code: "CS-601",
    name: "Machine Learning",
    semester: 6,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Introduction to Machine Learning", topics: "Supervised, Unsupervised, Semi-supervised & Reinforcement learning, PAC learning, Hypothesis spaces, Overfitting" },
      { id: "u2", number: "UNIT II", name: "Supervised Regression & Classification", topics: "Linear & polynomial regression, Logistic regression, Naive Bayes classifier, Decision trees (ID3, C4.5, CART)" },
      { id: "u3", number: "UNIT III", name: "Support Vector Machines & Neural Networks", topics: "Linear and non-linear SVM, Kernel trick, Perceptron model, Multilayer perceptron (MLP), Backpropagation" },
      { id: "u4", number: "UNIT IV", name: "Unsupervised Learning & Clustering", topics: "K-Means, Gaussian Mixture Models (GMM), Expectation-Maximization, Principal Component Analysis (PCA)" },
      { id: "u5", number: "UNIT V", name: "Ensemble Methods & Model Evaluation", topics: "Bagging, Boosting (AdaBoost, XGBoost), Random Forests, Cross-validation, Precision-Recall, ROC-AUC curves" },
    ],
  },
  {
    code: "CS-602",
    name: "Computer Networks",
    semester: 6,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Network Models & Physical Layer", topics: "OSI and TCP/IP reference models, Network topologies, Transmission media, Multiplexing (FDM/TDM), Switching" },
      { id: "u2", number: "UNIT II", name: "Data Link Layer & MAC Sublayer", topics: "Framing, Error detection (CRC, Checksum), Sliding window protocols, CSMA/CD, CSMA/CA, Ethernet standards" },
      { id: "u3", number: "UNIT III", name: "Network Layer & Routing", topics: "IPv4 & IPv6 addressing, Subnetting, CIDR, ARP, RARP, Routing algorithms (Distance Vector, OSPF, BGP), ICMP" },
      { id: "u4", number: "UNIT IV", name: "Transport Layer", topics: "Transport services, TCP connection management, 3-way handshake, Flow control (Sliding window), UDP, Congestion control" },
      { id: "u5", number: "UNIT V", name: "Application Layer & Network Security", topics: "DNS, HTTP, FTP, SMTP, Cryptography basics, Symmetric/Asymmetric ciphers, Firewalls, VPN & TLS/SSL" },
    ],
  },
  {
    code: "CS-603",
    name: "Compiler Design",
    semester: 6,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Introduction to Compilers & Lexical Analysis", topics: "Phases of a compiler, Compiler-construction tools, Regular expressions, Lexical token recognition, LEX tool" },
      { id: "u2", number: "UNIT II", name: "Syntax Analysis & Top-Down Parsing", topics: "Context-free grammars, Ambiguity removal, Top-down parsing, Recursive descent, LL(1) parsers, First & Follow sets" },
      { id: "u3", number: "UNIT III", name: "Bottom-Up Parsing", topics: "Shift-reduce parsing, Operator precedence parsing, LR parsers (SLR, Canonical LR, LALR), YACC parser generator" },
      { id: "u4", number: "UNIT IV", name: "Syntax-Directed Translation & Intermediate Code", topics: "Syntax-directed definitions (SDD), Evaluation orders, Three-address code, Quadruples, Triples, Type checking" },
      { id: "u5", number: "UNIT V", name: "Code Optimization & Code Generation", topics: "Principal sources of optimization, Loop optimization, DAG representation of basic blocks, Peephole optimization" },
    ],
  },
  {
    code: "CS-604",
    name: "Computer Graphics & Visualization",
    semester: 6,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Graphics Systems & Primitive Generation", topics: "Display technologies (CRT, Flat-panel), Frame buffer, DDA line algorithm, Bresenham’s line & Midpoint circle" },
      { id: "u2", number: "UNIT II", name: "2D Geometric Transformations & Clipping", topics: "Translation, Scaling, Rotation, Matrix representations, Cohen-Sutherland line clipping, Sutherland-Hodgman polygon" },
      { id: "u3", number: "UNIT III", name: "3D Concepts & Transformations", topics: "3D display techniques, 3D translation, rotation, scaling, Parallel & Perspective projections, Viewing pipeline" },
      { id: "u4", number: "UNIT IV", name: "Curves, Surfaces & Hidden Surface Removal", topics: "Bezier and B-Spline curves, Hidden surface elimination: Z-buffer algorithm, Painter's algorithm, Back-face culling" },
      { id: "u5", number: "UNIT V", name: "Illumination Models & Shading", topics: "Ambient, Diffuse and Specular reflection, Phong & Gouraud shading models, Color models (RGB, CMYK, HSV)" },
    ],
  },

  // ─── Semester 7 ───
  {
    code: "CS-701",
    name: "Software Architectures",
    semester: 7,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Software Architecture Fundamentals", topics: "Architecture business cycle, Architectural patterns, Reference models, Software quality attributes" },
      { id: "u2", number: "UNIT II", name: "Architectural Styles & Patterns", topics: "Data flow systems, Call-and-return architectures, Layered systems, Event-driven systems, Microservices architecture" },
      { id: "u3", number: "UNIT III", name: "Architecture Design & Documentation", topics: "Attribute-Driven Design (ADD), Documenting software architectures, 4+1 View model, Architectural decision records" },
      { id: "u4", number: "UNIT IV", name: "Architectural Evaluation", topics: "Architecture Tradeoff Analysis Method (ATAM), Cost Benefit Analysis Method (CBAM), Software architecture reviews" },
      { id: "u5", number: "UNIT V", name: "Enterprise Architecture & Modern Trends", topics: "Service-Oriented Architecture (SOA), Cloud-native architectures, Serverless design patterns, DevOps integration" },
    ],
  },
  {
    code: "CS-702",
    name: "Deep & Reinforcement Learning",
    semester: 7,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Deep Neural Networks Fundamentals", topics: "Perceptron to deep feedforward networks, Activation functions (ReLU, Sigmoid, Tanh), Backpropagation algorithm" },
      { id: "u2", number: "UNIT II", name: "Convolutional Neural Networks (CNN)", topics: "Convolution & pooling layers, Padding, Stride, ResNet, VGG, Inception architectures, Applications in computer vision" },
      { id: "u3", number: "UNIT III", name: "Recurrent Neural Networks (RNN)", topics: "Vanishing gradient problem, LSTM networks, Gated Recurrent Units (GRU), Sequence-to-sequence models & Attention" },
      { id: "u4", number: "UNIT IV", name: "Generative Models & Transformers", topics: "Autoencoders, Variational Autoencoders (VAE), Generative Adversarial Networks (GANs), Transformer architecture" },
      { id: "u5", number: "UNIT V", name: "Reinforcement Learning", topics: "Markov Decision Process (MDP), Bellman equations, Value iteration, Q-Learning, Deep Q-Networks (DQN), Policy gradients" },
    ],
  },
  {
    code: "CS-703",
    name: "Cryptography & Information Security",
    semester: 7,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Classical Encryption & Security Principles", topics: "Confidentiality, Integrity, Availability (CIA), Symmetric vs asymmetric ciphers, Substitution & Transposition ciphers" },
      { id: "u2", number: "UNIT II", name: "Symmetric Key Cryptography", topics: "Block cipher principles, Data Encryption Standard (DES), Advanced Encryption Standard (AES), Cipher block modes" },
      { id: "u3", number: "UNIT III", name: "Public Key Cryptography & Key Exchange", topics: "Modular arithmetic, Prime numbers, Fermat's & Euler's theorems, RSA algorithm, Diffie-Hellman key exchange, ECC" },
      { id: "u4", number: "UNIT IV", name: "Cryptographic Hash Functions & Signatures", topics: "SHA-256, MD5, Message Authentication Codes (HMAC), Digital Signature Standard (DSS), Public Key Infrastructure (PKI)" },
      { id: "u5", number: "UNIT V", name: "Network Security & Defenses", topics: "IPsec architecture, SSL/TLS handshake protocol, PGP email security, Intrusion Detection Systems (IDS), Firewalls" },
    ],
  },
  {
    code: "CS-704",
    name: "Big Data Analytics",
    semester: 7,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Big Data Architecture & Ecosystem", topics: "Characteristics of Big Data (5 V's), Distributed computing challenges, Hadoop architecture, HDFS storage system" },
      { id: "u2", number: "UNIT II", name: "Hadoop MapReduce Framework", topics: "MapReduce programming model, Map, Shuffle and Reduce phases, YARN resource manager, Fault tolerance" },
      { id: "u3", number: "UNIT III", name: "Apache Spark & In-Memory Analytics", topics: "Spark architecture, Resilient Distributed Datasets (RDDs), Spark SQL, DataFrames, Transformations and actions" },
      { id: "u4", number: "UNIT IV", name: "NoSQL Databases", topics: "CAP theorem, BASE properties, Key-Value stores, Columnar databases (HBase), Document stores (MongoDB), Graph databases" },
      { id: "u5", number: "UNIT V", name: "Stream Processing & Big Data Machine Learning", topics: "Real-time streaming with Apache Kafka, Spark Streaming, MLlib for distributed machine learning, Case studies" },
    ],
  },

  // ─── Semester 8 ───
  {
    code: "CS-801",
    name: "Internet of Things (IoT)",
    semester: 8,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Introduction to Internet of Things (IoT)", topics: "IoT definition, Characteristics, Physical & logical design, IoT enabled technologies, M2M vs IoT comparison" },
      { id: "u2", number: "UNIT II", name: "Sensors, Actuators & Microcontrollers", topics: "Sensor classification, Transducers, Actuators, Embedded platforms (Arduino, Raspberry Pi, ESP32/ESP8266)" },
      { id: "u3", number: "UNIT III", name: "IoT Networking Protocols", topics: "IEEE 802.15.4, Zigbee, 6LoWPAN, Bluetooth Low Energy (BLE), LoRaWAN, CoAP, MQTT, REST HTTP architecture" },
      { id: "u4", number: "UNIT IV", name: "IoT Cloud & Edge Analytics", topics: "Cloud storage for IoT, Data analytics at edge vs cloud, AWS IoT / Azure IoT Hub integration, Digital twins" },
      { id: "u5", number: "UNIT V", name: "IoT Security & Smart Applications", topics: "Vulnerabilities in IoT, Device security, Smart cities, Industrial IoT (IIoT), Smart healthcare, Connected vehicles" },
    ],
  },
  {
    code: "CS-802",
    name: "Blockchain Technologies",
    semester: 8,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Blockchain Architecture & Cryptography", topics: "Distributed ledger technology, Peer-to-peer networks, Cryptographic hashing (SHA-256), Merkle trees, Digital signatures" },
      { id: "u2", number: "UNIT II", name: "Consensus Mechanisms", topics: "Proof of Work (PoW), Proof of Stake (PoS), Delegated PoS, Practical Byzantine Fault Tolerance (PBFT), Mining process" },
      { id: "u3", number: "UNIT III", name: "Ethereum & Smart Contracts", topics: "Ethereum Virtual Machine (EVM), Solidity programming, Gas mechanics, Smart contract lifecycle, Security pitfalls" },
      { id: "u4", number: "UNIT IV", name: "Enterprise Blockchains", topics: "Hyperledger Fabric architecture, Membership Service Providers (MSP), Chaincode, Permissioned vs permissionless" },
      { id: "u5", number: "UNIT V", name: "Decentralized Applications & Future Trends", topics: "DApps development, Web3 architecture, Decentralized Finance (DeFi), Tokenomics, Scalability (Layer 2 solutions)" },
    ],
  },
  {
    code: "CS-803",
    name: "Cloud Computing",
    semester: 8,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Cloud Computing Principles & Service Models", topics: "Cloud definition, Essential characteristics, Service models (IaaS, PaaS, SaaS), Deployment models" },
      { id: "u2", number: "UNIT II", name: "Virtualization Technologies", topics: "Hypervisors (Type 1 & Type 2), CPU, Memory and I/O virtualization, Virtual machines, Containerization vs Virtualization" },
      { id: "u3", number: "UNIT III", name: "Cloud Storage & Resource Management", topics: "Distributed file systems, Object storage (Amazon S3), Elastic resource provisioning, Dynamic load balancing" },
      { id: "u4", number: "UNIT IV", name: "Cloud Security & Governance", topics: "Shared responsibility model, Identity and Access Management (IAM), Data encryption in cloud, Compliance & SLA" },
      { id: "u5", number: "UNIT V", name: "Cloud Native & Serverless Computing", topics: "Docker containers, Kubernetes orchestration, Function-as-a-Service (AWS Lambda), Cloud design patterns" },
    ],
  },
  {
    code: "CS-804",
    name: "Major Project & Seminar",
    semester: 8,
    branch: "CSE",
    course: "B.Tech",
    units: [
      { id: "u1", number: "UNIT I", name: "Problem Identification & Feasibility Analysis", topics: "Literature review, Problem statement formulation, Technical & economic feasibility, Industry scope" },
      { id: "u2", number: "UNIT II", name: "System Requirements & Specifications", topics: "Hardware and software requirement specifications, Architecture selection, Technology stack finalization" },
      { id: "u3", number: "UNIT III", name: "Design & Implementation", topics: "System architectural design, Database schema, Modular coding, API integrations, Core module development" },
      { id: "u4", number: "UNIT IV", name: "Testing, Verification & Optimization", topics: "Unit testing, Integration testing, Performance benchmarks, Code optimization, Bug tracking & debugging" },
      { id: "u5", number: "UNIT V", name: "Documentation, Deployment & Seminar", topics: "Project report preparation, Research paper writing, Deployment to live environment, Final viva defense" },
    ],
  },
];

export const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notes_db";
    
    // Mask credentials when printing to logs for security
    const sanitizedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@");
    console.log(`[Seed] Connecting to MongoDB target: ${sanitizedURI}`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
    });

    const isAtlas = mongoURI.includes(".mongodb.net");
    console.log(`[Seed] Successfully connected to ${isAtlas ? "MongoDB Atlas Cloud Cluster" : "Local MongoDB instance"}`);

    // Drop legacy conflicting unique index on 'name' if present from older schemas
    try {
      await Subject.collection.dropIndex("name_1");
      console.log("[Seed] Dropped legacy unique index 'name_1' on subjects");
    } catch (_) {}

    // 1. Seed all 32 Subjects
    console.log(`[Seed] Seeding ${allSubjectsData.length} Subjects with complete units...`);
    let subjectsUpdated = 0;
    for (const sub of allSubjectsData) {
      await Subject.findOneAndUpdate(
        { code: sub.code },
        sub,
        { upsert: true, new: true }
      );
      subjectsUpdated++;
    }
    console.log(`[Seed] Successfully synced ${subjectsUpdated} subjects.`);

    // 2. Generate and Seed Materials (Official Syllabus, Unit Notes, PYQs, Important Topics)
    console.log("[Seed] Generating comprehensive study materials & official syllabus for all subjects...");
    const materialsToSeed = [];

    for (const sub of allSubjectsData) {
      const cleanCode = sub.code.replace(/[^a-zA-Z0-9]/g, "");

      // A. Official Syllabus for every subject
      materialsToSeed.push({
        title: `${sub.code}: Official RGPV Approved Scheme & Syllabus`,
        resourceType: "syllabus",
        subjectCode: sub.code,
        semester: sub.semester,
        branch: sub.branch,
        course: sub.course,
        description: `Official RGPV curriculum outline for ${sub.name} (${sub.code}). Contains all unit breakdowns and exam credit schemes.`,
        author: "RGPV Academic Council",
        file: {
          fileId: `syllabus_${cleanCode.toLowerCase()}`,
          url: `https://ik.imagekit.io/eduvault_demo/syllabus/${cleanCode}_Syllabus.pdf`,
          thumbnailUrl: `https://ik.imagekit.io/eduvault_demo/syllabus/${cleanCode}_Syllabus.pdf/ik-thumbnail.jpg`,
          fileName: `${sub.code}_Official_Syllabus.pdf`,
          fileType: "pdf",
          sizeBytes: 1450000,
          pagesCount: 6,
        },
        viewsCount: 312,
        downloadsCount: 89,
        isPublished: true,
      });

      // B. Handwritten Notes for each Unit
      for (const unit of sub.units) {
        materialsToSeed.push({
          title: `${sub.code} ${unit.number}: ${unit.name} Handwritten Notes`,
          resourceType: "handwritten-notes",
          subjectCode: sub.code,
          unitNumber: unit.number,
          unitId: unit.id,
          semester: sub.semester,
          branch: sub.branch,
          course: sub.course,
          description: `Verified topper handwritten notes covering ${unit.topics}.`,
          author: "EduVault Contributor (RGPV Topper)",
          file: {
            fileId: `notes_${cleanCode.toLowerCase()}_${unit.id}`,
            url: `https://ik.imagekit.io/eduvault_demo/notes/${cleanCode}_${unit.id}_Notes.pdf`,
            thumbnailUrl: `https://ik.imagekit.io/eduvault_demo/notes/${cleanCode}_${unit.id}_Notes.pdf/ik-thumbnail.jpg`,
            fileName: `${sub.code}_${unit.number.replace(/\s+/g, "")}_Notes.pdf`,
            fileType: "pdf",
            sizeBytes: 4200000,
            pagesCount: 22,
          },
          viewsCount: 184,
          downloadsCount: 47,
          isPublished: true,
        });
      }

      // C. Previous Year Question Paper (PYQ)
      materialsToSeed.push({
        title: `${sub.code}: RGPV End-Semester 2023 Solved Question Paper`,
        resourceType: "pyq",
        subjectCode: sub.code,
        semester: sub.semester,
        branch: sub.branch,
        course: sub.course,
        year: "2023",
        description: `Official RGPV Dec 2023 examination paper with step-by-step marking scheme and model answers.`,
        author: "RGPV Examination Cell",
        file: {
          fileId: `pyq_${cleanCode.toLowerCase()}_2023`,
          url: `https://ik.imagekit.io/eduvault_demo/pyq/${cleanCode}_PYQ_2023.pdf`,
          thumbnailUrl: `https://ik.imagekit.io/eduvault_demo/pyq/${cleanCode}_PYQ_2023.pdf/ik-thumbnail.jpg`,
          fileName: `${sub.code}_PYQ_2023.pdf`,
          fileType: "pdf",
          sizeBytes: 2100000,
          pagesCount: 8,
        },
        viewsCount: 275,
        downloadsCount: 92,
        isPublished: true,
      });

      // D. Unit Wise Important Questions
      materialsToSeed.push({
        title: `${sub.code}: High-Yield Repeated Exam Topics & Questions`,
        resourceType: "unit-wise-important",
        subjectCode: sub.code,
        semester: sub.semester,
        branch: sub.branch,
        course: sub.course,
        frequency: "Very High (Repeated 5+ years)",
        description: `Curated list of frequently repeated questions from previous 7 years of RGPV papers for ${sub.name}.`,
        author: "Department Faculty",
        file: {
          fileId: `important_${cleanCode.toLowerCase()}`,
          url: `https://ik.imagekit.io/eduvault_demo/important/${cleanCode}_Important_Questions.pdf`,
          thumbnailUrl: `https://ik.imagekit.io/eduvault_demo/important/${cleanCode}_Important_Questions.pdf/ik-thumbnail.jpg`,
          fileName: `${sub.code}_Important_Questions.pdf`,
          fileType: "pdf",
          sizeBytes: 1650000,
          pagesCount: 12,
        },
        viewsCount: 420,
        downloadsCount: 135,
        isPublished: true,
      });
    }

    // Upsert materials using a unique key compound: { subjectCode, resourceType, unitNumber, year }
    let materialsSaved = 0;
    for (const mat of materialsToSeed) {
      await Material.findOneAndUpdate(
        {
          subjectCode: mat.subjectCode,
          resourceType: mat.resourceType,
          unitNumber: mat.unitNumber || "",
          year: mat.year || "",
        },
        mat,
        { upsert: true, new: true }
      );
      materialsSaved++;
    }

    console.log(`[Seed] Successfully seeded ${materialsSaved} materials (including Syllabus, Handwritten Notes, PYQs, and Important Topics)!`);
    console.log(`[Seed] Database cluster is now fully populated with ${subjectsUpdated} subjects and ${materialsSaved} study materials.`);

    await mongoose.disconnect();
    console.log("[Seed] Connection closed gracefully.");
  } catch (error) {
    console.error("[Seed Error]", error.message);
    process.exit(1);
  }
};

// Auto-run if executed directly
if (process.argv[1]?.endsWith("seedCurriculum.js")) {
  seedDatabase();
}
