import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Unit({
  university = { code: "RGPV", name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya" },
  course = { id: "btech", code: "B.Tech", name: "Bachelor of Technology", duration: "4 Years · 8 Semesters" },
  branch = { id: "cse", code: "CSE", name: "Computer Science & Engineering" },
  semester = { id: 1, name: "Semester 1" },
  subject = { id: "chem", code: "BT-101", name: "Engineering Chemistry" },
  onNavigateToDashboard,
  onNavigateToCourses,
  onNavigateToBranch,
  onNavigateToSemester,
  onNavigateToSubject,
  onNavigateToResources,
  onNavigateToSettings,
  onNavigateToFeedback,
  onNavigateToHome,
  onSelectUnit,
  isDarkMode: propIsDarkMode,
  onToggleTheme,
}) {
  const { user, logout } = useAuth();
  const { isDarkMode: ctxDarkMode, toggleTheme: ctxToggleTheme } = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : ctxDarkMode;
  const toggleTheme = onToggleTheme || ctxToggleTheme;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Official RGPV Portal Unit Syllabus Mapping (5 Units per subject)
  const rgpvUnitsMap = {
    // ─── Semester 1 ───
    "BT-101": [
      { id: "u1", number: "UNIT I", name: "Water – Analysis, Treatments and Industrial Applications", topics: "Sources, Hardness determination (EDTA), Boiler troubles, Lime-Soda & Zeolite softening" },
      { id: "u2", number: "UNIT II", name: "Fuels and Combustion", topics: "Fossil fuels, Higher/Lower calorific values, Bomb calorimeter, Proximate & Ultimate coal analysis" },
      { id: "u3", number: "UNIT III", name: "Lubricants and Polymerization", topics: "Lubrication mechanisms, Viscosity index, Thermosetting & Thermoplastics, Elastomers" },
      { id: "u4", number: "UNIT IV", name: "Phase Equilibrium and Corrosion", topics: "Gibb's phase rule, Water system, Chemical/electrochemical corrosion mechanisms & prevention" },
      { id: "u5", number: "UNIT V", name: "Spectroscopic Techniques and Periodic Properties", topics: "UV-Visible & IR spectroscopy principles, Slater's rules, Periodic orbital energy trends" },
    ],
    "BT-102": [
      { id: "u1", number: "UNIT I", name: "Calculus - I", topics: "Rolle’s & Mean Value theorems, Taylor’s & Maclaurin's expansions, Maxima and Minima" },
      { id: "u2", number: "UNIT II", name: "Calculus - II", topics: "Definite integrals, Beta & Gamma functions, Multiple double/triple integrals & area/volume" },
      { id: "u3", number: "UNIT III", name: "Sequences and Series", topics: "Convergence tests, Power series, Fourier series half-range sine/cosine & Parseval's theorem" },
      { id: "u4", number: "UNIT IV", name: "Vector Spaces", topics: "Vector space & subspaces, Linear independence, Basis and Dimension, Linear transformations" },
      { id: "u5", number: "UNIT V", name: "Matrices", topics: "Rank of matrix, Elementary transformations, System of linear equations, Eigenvalues & Eigenvectors" },
    ],
    "BT-103": [
      { id: "u1", number: "UNIT I", name: "Communication & Language Skills", topics: "Communication process, Barriers, Verbal & non-verbal communication, Active listening" },
      { id: "u2", number: "UNIT II", name: "Vocabulary & Grammar Usage", topics: "Word formation, Synonyms/antonyms, Common errors in English, Concord & Prepositions" },
      { id: "u3", number: "UNIT III", name: "Technical Writing & Composition", topics: "Formal letter writing, Resume & CV preparation, Technical reports & Executive summaries" },
      { id: "u4", number: "UNIT IV", name: "Reading Comprehension & Analysis", topics: "Techniques for effective reading, Skimming, Scanning, Critical analysis of technical texts" },
      { id: "u5", number: "UNIT V", name: "Listening & Presentation Skills", topics: "Listening types, Barriers to listening, Professional presentations, Group discussions" },
    ],
    "BT-104": [
      { id: "u1", number: "UNIT I", name: "D.C. Circuits & Network Theorems", topics: "Kirchhoff’s laws (KCL/KVL), Mesh and Nodal analysis, Thevenin's, Norton's & Superposition theorems" },
      { id: "u2", number: "UNIT II", name: "1-Phase & 3-Phase A.C. Circuits", topics: "RMS and average values, Form factor, Series/parallel RLC circuits, Resonance, 3-Phase balanced circuits" },
      { id: "u3", number: "UNIT III", name: "Magnetic Circuits & Transformers", topics: "B-H curve, Magnetic circuits, Single-phase transformers EMF equation, Equivalent circuit & Losses" },
      { id: "u4", number: "UNIT IV", name: "Electrical Machines", topics: "Construction & working principles of DC machines, 3-Phase induction motors & Synchronous generators" },
      { id: "u5", number: "UNIT V", name: "Semiconductor Diodes & Transistors", topics: "PN junction diode, V-I characteristics, Rectifiers, Zener diode, BJT configurations & Biasing" },
    ],
    "BT-105": [
      { id: "u1", number: "UNIT I", name: "Introduction to Engineering Drawing & Scales", topics: "Drawing instruments, Lettering & dimensioning, Representative fraction (RF), Plain & Diagonal scales" },
      { id: "u2", number: "UNIT II", name: "Engineering Curves & Conic Sections", topics: "Ellipse, Parabola, Hyperbola, Cycloid, Epicycloid, Involutes and Spirals" },
      { id: "u3", number: "UNIT III", name: "Projections of Points, Lines & Planes", topics: "1st & 3rd angle projection, True length & inclinations, Traces of lines, Projections of planes" },
      { id: "u4", number: "UNIT IV", name: "Projections & Sections of Solids", topics: "Prisms, Pyramids, Cylinders and Cones axis inclined, Section planes & true shapes of sections" },
      { id: "u5", number: "UNIT V", name: "Isometric Projections & CAD Basics", topics: "Isometric scale and views of planar & solid shapes, Introduction to CAD software commands" },
    ],

    // ─── Semester 2 ───
    "BT-201": [
      { id: "u1", number: "UNIT I", name: "Wave Nature of Particles & Quantum Mechanics", topics: "De-Broglie waves, Wave-particle duality, Heisenberg uncertainty principle, Schrödinger wave equation" },
      { id: "u2", number: "UNIT II", name: "Wave Optics", topics: "Interference in thin films, Newton's rings, Fraunhofer diffraction through single slit & Diffraction grating" },
      { id: "u3", number: "UNIT III", name: "Solid State Physics & Semiconductors", topics: "Kronig-Penney model, Energy band diagram, Intrinsic and Extrinsic semiconductors, Hall effect" },
      { id: "u4", number: "UNIT IV", name: "Lasers & Fiber Optics", topics: "Stimulated emission, Population inversion, Ruby & He-Ne lasers, Optical fiber numerical aperture" },
      { id: "u5", number: "UNIT V", name: "Electromagnetism & Dielectrics", topics: "Maxwell's equations, Electromagnetic wave propagation in free space, Dielectric polarization" },
    ],
    "BT-202": [
      { id: "u1", number: "UNIT I", name: "First Order Ordinary Differential Equations", topics: "Exact equations, Integrating factors, Linear differential equations, Bernoulli's equation, Applications" },
      { id: "u2", number: "UNIT II", name: "Linear Differential Equations of Higher Order", topics: "Higher order linear ODEs with constant coefficients, Method of variation of parameters, Cauchy-Euler" },
      { id: "u3", number: "UNIT III", name: "Second Order ODEs & Series Solutions", topics: "Second order linear differential equations with variable coefficients, Frobenius method, Bessel functions" },
      { id: "u4", number: "UNIT IV", name: "Partial Differential Equations", topics: "First order partial differential equations, Lagrange's linear equation, Charpit’s method, Wave equation" },
      { id: "u5", number: "UNIT V", name: "Vector Calculus", topics: "Gradient, Divergence and Curl, Line/Surface/Volume integrals, Green's, Gauss and Stokes' theorems" },
    ],
    "BT-203": [
      { id: "u1", number: "UNIT I", name: "Materials & Engineering Mechanics", topics: "Classification of engineering materials, Stress-strain diagrams, Laws of mechanics, Lami's theorem" },
      { id: "u2", number: "UNIT II", name: "Thermodynamics & Steam Properties", topics: "Zeroth, 1st and 2nd laws of thermodynamics, Carnot cycle, Steam properties, Steam boilers & mountings" },
      { id: "u3", number: "UNIT III", name: "Internal Combustion Engines", topics: "Working of 2-stroke and 4-stroke petrol & diesel engines, Otto & Diesel cycles, Basic refrigeration" },
      { id: "u4", number: "UNIT IV", name: "Fluids & Hydraulic Machines", topics: "Pascal’s law, Bernoulli’s theorem, Pumps, Pelton wheel, Francis and Kaplan hydraulic turbines" },
      { id: "u5", number: "UNIT V", name: "Manufacturing Processes", topics: "Pattern making, Casting processes, Welding techniques (Arc & Gas), Lathe & Drilling machine tools" },
    ],
    "BT-204": [
      { id: "u1", number: "UNIT I", name: "Building Materials & Construction", topics: "Properties of stones, Bricks, Cement, Mortar, Concrete, Types of foundations, Brick masonry" },
      { id: "u2", number: "UNIT II", name: "Surveying & Levelling", topics: "Principles of surveying, Chain surveying, Compass surveying, Ranging, Levelling and contouring" },
      { id: "u3", number: "UNIT III", name: "Coplanar Force Systems & Equilibrium", topics: "Force systems, Resolution and composition of forces, Moment of force, Varignon's theorem, Equilibrium" },
      { id: "u4", number: "UNIT IV", name: "Beams, Trusses & Friction", topics: "Types of beams and supports, Shear force & Bending moment diagrams (SFD/BMD), Analysis of plane trusses" },
      { id: "u5", number: "UNIT V", name: "Centroid & Moment of Inertia", topics: "Centroid of composite figures, Area moment of inertia, Parallel and Perpendicular axis theorems" },
    ],
    "BT-205": [
      { id: "u1", number: "UNIT I", name: "Computer Hardware & Operating Systems", topics: "Computer architecture block diagram, Primary & secondary storage, OS functions, DOS & Linux commands" },
      { id: "u2", number: "UNIT II", name: "Number Systems & Digital Logic", topics: "Binary, Octal, Hexadecimal conversions, 1's & 2's complements, Logic gates, Boolean laws, De Morgan's" },
      { id: "u3", number: "UNIT III", name: "Object Oriented Programming (C++)", topics: "OOP concepts, Classes and objects, Data types, Control structures, Functions, Constructors, Destructors" },
      { id: "u4", number: "UNIT IV", name: "Inheritance, Polymorphism & Pointers", topics: "Single, Multiple & Multilevel inheritance, Function overloading, Operator overloading, Pointers" },
      { id: "u5", number: "UNIT V", name: "Data Structures & Computer Networks", topics: "Arrays, Stacks, Queues, Linked lists basics, LAN, MAN, WAN, OSI model layers, Internet fundamentals" },
    ],

    // ─── Semester 3 ───
    "ES-301": [
      { id: "u1", number: "UNIT I", name: "Energy Resources & Conventional Power", topics: "Global energy scenario, Fossil fuel reserves, Thermal, Hydro, and Nuclear power generation systems" },
      { id: "u2", number: "UNIT II", name: "Renewable Energy Sources", topics: "Solar PV and thermal systems, Wind energy conversion, Biomass, Geothermal & Ocean energy technologies" },
      { id: "u3", number: "UNIT III", name: "Ecosystems and Biodiversity", topics: "Ecosystem structure & function, Food chains, Food webs, Biodiversity values, Threats & in-situ/ex-situ conservation" },
      { id: "u4", number: "UNIT IV", name: "Environmental Pollution and Control", topics: "Air, Water, Soil, Noise and Marine pollution causes, Effects and abatement technologies, Solid waste management" },
      { id: "u5", number: "UNIT V", name: "EIA and Sustainable Development", topics: "Environmental Impact Assessment methodology, Carbon credits, Kyoto protocol, Green building standards" },
    ],
    "CS-302": [
      { id: "u1", number: "UNIT I", name: "Set Theory, Relations & Functions", topics: "Set identities, Countability, Equivalence relations, Partial ordering, Inverse & recursively defined functions" },
      { id: "u2", number: "UNIT II", name: "Algebraic Structures", topics: "Semigroups, Monoids, Groups, Subgroups, Cyclic groups, Cosets, Lagrange’s theorem, Homomorphism, Rings" },
      { id: "u3", number: "UNIT III", name: "Propositional Logic & Finite Automata", topics: "Propositions, Logical equivalences, Normal forms (CNF/DNF), Quantifiers, Finite State Machines introduction" },
      { id: "u4", number: "UNIT IV", name: "Graph Theory", topics: "Planar & weighted graphs, Paths & cycles, Eulerian & Hamiltonian circuits, Graph coloring, Chromatic numbers" },
      { id: "u5", number: "UNIT V", name: "Posets, Lattices & Combinatorics", topics: "Hasse diagrams, Lattices properties, Permutations & Combinations, Linear recurrence relations, Generating functions" },
    ],
    "CS-303": [
      { id: "u1", number: "UNIT I", name: "Data Structures Overview & Linked Lists", topics: "Abstract Data Types (ADT), Arrays representation, Singly, Doubly, and Circular linked lists & applications" },
      { id: "u2", number: "UNIT II", name: "Stacks and Queues", topics: "Stack ADT, Infix to postfix conversion, Evaluation of postfix expressions, Circular queues, Deque & Priority queues" },
      { id: "u3", number: "UNIT III", name: "Trees & Binary Search Trees", topics: "Tree traversals (Inorder, Preorder, Postorder), Binary Search Tree (BST), AVL trees, Heaps, B-Trees & B+ trees" },
      { id: "u4", number: "UNIT IV", name: "Graphs & Spanning Trees", topics: "Graph representations (Adjacency matrix/list), BFS & DFS traversals, Prim's and Kruskal's MST, Dijkstra algorithm" },
      { id: "u5", number: "UNIT V", name: "Sorting, Searching & Hashing", topics: "Bubble, Insertion, Quick, Merge, and Heap sorts, Binary search, Hashing collision resolution techniques" },
    ],
    "CS-304": [
      { id: "u1", number: "UNIT I", name: "Number Systems & Boolean Algebra", topics: "Binary arithmetic, BCD, Gray codes, Boolean minimization, Karnaugh Maps (K-Map), Quine-McCluskey method" },
      { id: "u2", number: "UNIT II", name: "Combinational Logic Circuits", topics: "Half & Full Adders, Subtractors, Encoders, Decoders, Multiplexers, Demultiplexers, Parity generators" },
      { id: "u3", number: "UNIT III", name: "Sequential Logic Circuits", topics: "SR, JK, D, and T flip-flops, Master-slave flip-flops, Shift registers, Synchronous & Asynchronous counters" },
      { id: "u4", number: "UNIT IV", name: "Semiconductor Memories & PLDs", topics: "RAM, ROM, PROM, EPROM, Programmable Logic Arrays (PLA), Programmable Array Logic (PAL), FPGA architecture" },
      { id: "u5", number: "UNIT V", name: "Logic Families & Converters", topics: "TTL, ECL, and CMOS characteristics, D/A converters (R-2R ladder), A/D converters (Flash, Successive approx)" },
    ],
    "CS-305": [
      { id: "u1", number: "UNIT I", name: "Object Oriented Methodology & C++ Basics", topics: "Object-oriented paradigm vs structured, C++ tokens, Control structures, Inline functions, References" },
      { id: "u2", number: "UNIT II", name: "Classes, Objects & Constructors", topics: "Class specification, Data hiding, Static members, Parameterized constructors, Copy constructors, Destructors" },
      { id: "u3", number: "UNIT III", name: "Inheritance & Function Overloading", topics: "Derived classes, Access specifiers, Multiple & hierarchical inheritance, Function and operator overloading" },
      { id: "u4", number: "UNIT IV", name: "Polymorphism, Virtual Functions & Templates", topics: "Early vs late binding, Pure virtual functions, Abstract classes, Virtual base classes, Function & class templates" },
      { id: "u5", number: "UNIT V", name: "Exception Handling & File Streams", topics: "Try, catch, throw mechanisms, Custom exceptions, File stream classes, Sequential and random access file I/O" },
    ],

    // ─── Semester 4 ───
    "BT-401": [
      { id: "u1", number: "UNIT I", name: "Numerical Solutions of Algebraic Equations", topics: "Bisection method, Regula-Falsi method, Newton-Raphson method, Convergence criteria, System of linear equations" },
      { id: "u2", number: "UNIT II", name: "Interpolation & Approximation", topics: "Finite differences, Newton's forward and backward formulas, Gauss central difference, Lagrange’s interpolation" },
      { id: "u3", number: "UNIT III", name: "Numerical Differentiation & Integration", topics: "Numerical differentiation, Trapezoidal rule, Simpson’s 1/3 and 3/8 rules, Euler's and Runge-Kutta 4th order ODEs" },
      { id: "u4", number: "UNIT IV", name: "Transform Calculus", topics: "Laplace transforms, Inverse Laplace transforms, Convolution theorem, Fourier transforms and properties" },
      { id: "u5", number: "UNIT V", name: "Probability & Statistics", topics: "Discrete and continuous random variables, Binomial, Poisson, and Normal distributions, Sampling & hypothesis testing" },
    ],
    "CS-402": [
      { id: "u1", number: "UNIT I", name: "Algorithms & Divide and Conquer", topics: "Time and space complexity, Asymptotic notations (O, Ω, Θ), Master theorem, Binary search, Merge sort, Quick sort" },
      { id: "u2", number: "UNIT II", name: "Greedy Strategy", topics: "Knapsack problem, Job sequencing with deadlines, Optimal merge patterns, Prim's and Kruskal's MST, Dijkstra algorithm" },
      { id: "u3", number: "UNIT III", name: "Dynamic Programming", topics: "0/1 Knapsack, All-pairs shortest paths (Floyd-Warshall), Multistage graphs, Matrix chain multiplication, Bellman-Ford" },
      { id: "u4", number: "UNIT IV", name: "Backtracking & Branch and Bound", topics: "8-Queens problem, Hamiltonian cycles, Graph coloring, Traveling salesperson problem (TSP), 15-puzzle problem" },
      { id: "u5", number: "UNIT V", name: "NP-Hard and NP-Complete Problems", topics: "Deterministic vs non-deterministic algorithms, P, NP, NP-Hard, and NP-Complete classes, Cook’s theorem, Approximation" },
    ],
    "CS-403": [
      { id: "u1", number: "UNIT I", name: "Software Development Life Cycle & Models", topics: "Software engineering phases, Waterfall, Spiral, V-model, Prototyping, Agile framework, Scrum methodology" },
      { id: "u2", number: "UNIT II", name: "Software Requirements Engineering", topics: "Requirement elicitation, Functional & non-functional requirements, SRS document structure, Feasibility studies" },
      { id: "u3", number: "UNIT III", name: "Software Design & Architecture", topics: "Cohesion and Coupling, Architectural design styles, Modular decomposition, Function-oriented design, UML diagrams" },
      { id: "u4", number: "UNIT IV", name: "Software Testing & Quality Assurance", topics: "White-box testing (Basis path, Cyclomatic complexity), Black-box testing (Equivalence partitioning, BVA), SQA" },
      { id: "u5", number: "UNIT V", name: "Software Project Management", topics: "Project estimation (COCOMO model), Risk management, Software maintenance, Configuration management (SCM)" },
    ],
    "CS-404": [
      { id: "u1", number: "UNIT I", name: "Computer Architecture & Machine Instructions", topics: "Von Neumann architecture, Register transfer language, Bus architecture, Instruction cycles and addressing modes" },
      { id: "u2", number: "UNIT II", name: "Central Processing Unit & Arithmetic", topics: "Hardwired vs microprogrammed control unit, Fixed-point and floating-point arithmetic, Booth’s multiplication algorithm" },
      { id: "u3", number: "UNIT III", name: "Memory Organization", topics: "Memory hierarchy, Cache memory mapping techniques, Hit ratio, Replacement algorithms, Virtual memory & Paging" },
      { id: "u4", number: "UNIT IV", name: "Input-Output Organization", topics: "Peripheral devices, Programmed I/O, Interrupt-driven I/O, Direct Memory Access (DMA) transfer & IOP processor" },
      { id: "u5", number: "UNIT V", name: "Pipelining & Parallel Processors", topics: "Instruction pipelining, Pipeline hazards, Arithmetic pipeline, Vector processing, Superscalar & Multiprocessor structures" },
    ],
    "CS-405": [
      { id: "u1", number: "UNIT I", name: "Operating Systems Overview & Services", topics: "Evolution and types of OS (Batch, Time-sharing, Distributed), OS structures, System calls & System programs" },
      { id: "u2", number: "UNIT II", name: "File Systems & Disk Scheduling", topics: "File attributes & access methods, Directory structures, Allocation methods, Disk scheduling algorithms (FCFS, SSTF, SCAN)" },
      { id: "u3", number: "UNIT III", name: "Process Scheduling & Memory Management", topics: "Process states, PCB, Schedulers, FCFS, SJF, Priority, Round-Robin scheduling, Paging, Segmentation, Demand paging" },
      { id: "u4", number: "UNIT IV", name: "Concurrency, Deadlocks & Synchronization", topics: "Critical section problem, Semaphores, Classic synchronization problems, Deadlock characterization, Prevention & Banker’s algorithm" },
      { id: "u5", number: "UNIT V", name: "Distributed OS & Case Studies", topics: "Distributed systems concepts, Network OS, Security mechanisms, Protection domains, UNIX/Linux OS case study" },
    ],

    // ─── Semester 5 ───
    "CS-501": [
      { id: "u1", number: "UNIT I", name: "Introduction to Automata Theory", topics: "Automata machines, Finite automata as acceptors/translators, Moore and Mealy machines & mutual conversion" },
      { id: "u2", number: "UNIT II", name: "Finite Automata & Regular Expressions", topics: "Deterministic & Non-deterministic FA (DFA/NFA), NFA to DFA conversion, Minimization, Arden's theorem, Regular sets" },
      { id: "u3", number: "UNIT III", name: "Chomsky Hierarchy & Grammars", topics: "Grammar types, Context-Free Grammar (CFG), Derivation trees, Ambiguity, Simplification, Normal forms (CNF & GNF)" },
      { id: "u4", number: "UNIT IV", name: "Pushdown Automata (PDA)", topics: "PDA formal definition, Acceptance by final state & empty stack, Equivalence of PDA and CFG, Deterministic PDA" },
      { id: "u5", number: "UNIT V", name: "Turing Machines & Computability", topics: "Turing Machine construction, Universal TM, Decidability, Halting problem, Post Correspondence Problem (PCP)" },
    ],
    "CS-502": [
      { id: "u1", number: "UNIT I", name: "DBMS Concepts and Architecture", topics: "Database vs file system, 3-Schema architecture, Data independence, ER modeling, Generalization & Specialization" },
      { id: "u2", number: "UNIT II", name: "Relational Data Model & SQL", topics: "Relational algebra operations, Tuple & Domain calculus, SQL DDL/DML, Constraints, Joins, Subqueries & Triggers" },
      { id: "u3", number: "UNIT III", name: "Database Design & Normalization", topics: "Functional dependencies, Normal forms (1NF, 2NF, 3NF, BCNF, 4NF), Lossless join decomposition & Dependency preservation" },
      { id: "u4", number: "UNIT IV", name: "Transaction Processing & Concurrency", topics: "ACID properties, Serializability, Lock-based protocols (2PL), Timestamp ordering, Deadlock detection & Log recovery" },
      { id: "u5", number: "UNIT V", name: "Storage & RDBMS Architecture", topics: "File organization, B-Tree and B+ Tree indexing, Hashing, Query optimization, Oracle/PostgreSQL database internals" },
    ],
    "CS-503": [
      { id: "u1", number: "UNIT I", name: "Data Analytics Foundations", topics: "Data analytics lifecycle, Structured vs unstructured data, Exploratory data analysis (EDA), Summary statistics" },
      { id: "u2", number: "UNIT II", name: "Data Preprocessing & Cleaning", topics: "Missing value imputation, Outlier detection, Feature scaling, Normalization, Dimensionality reduction (PCA)" },
      { id: "u3", number: "UNIT III", name: "Statistical Modeling & Regression", topics: "Simple & multiple linear regression, Logistic regression, Model diagnostics, Confidence intervals & Residual analysis" },
      { id: "u4", number: "UNIT IV", name: "Classification & Clustering", topics: "Decision trees, K-Nearest Neighbors (KNN), K-Means clustering, Hierarchical clustering & Evaluation metrics" },
      { id: "u5", number: "UNIT V", name: "Big Data Analytics Tools & Visualization", topics: "R and Python data science ecosystems, Tableau/PowerBI dashboards, Ethics in data analytics & Case studies" },
    ],
    "CS-504": [
      { id: "u1", number: "UNIT I", name: "Web Fundamentals & Client Technologies", topics: "Internet protocols (HTTP/HTTPS, DNS), Web browsers architecture, HTML5 semantic elements & Responsive CSS3" },
      { id: "u2", number: "UNIT II", name: "JavaScript & DOM Scripting", topics: "Modern ES6+ syntax, DOM manipulation, Event-driven programming, Form validation, Promises and Async/Await" },
      { id: "u3", number: "UNIT III", name: "Server-Side Programming", topics: "Server architectures, Node.js runtime, Express framework, Request handling, Middleware & RESTful API development" },
      { id: "u4", number: "UNIT IV", name: "Database Integration & Security", topics: "Database connectivity (MongoDB/MySQL), User authentication (JWT, OAuth), CORS, XSS and CSRF prevention" },
      { id: "u5", number: "UNIT V", name: "Web Services & Modern Deployment", topics: "JSON/XML web services, WebSockets real-time communication, CI/CD pipelines and Cloud hosting deployment" },
    ],

    // ─── Semester 6 ───
    "CS-601": [
      { id: "u1", number: "UNIT I", name: "Introduction to Machine Learning", topics: "Supervised, Unsupervised, Semi-supervised & Reinforcement learning, PAC learning, Hypothesis spaces, Overfitting" },
      { id: "u2", number: "UNIT II", name: "Supervised Regression & Classification", topics: "Linear & polynomial regression, Logistic regression, Naive Bayes classifier, Decision trees (ID3, C4.5, CART)" },
      { id: "u3", number: "UNIT III", name: "Support Vector Machines & Neural Networks", topics: "Linear and non-linear SVM, Kernel trick, Perceptron model, Multilayer perceptron (MLP), Backpropagation" },
      { id: "u4", number: "UNIT IV", name: "Unsupervised Learning & Clustering", topics: "K-Means, Gaussian Mixture Models (GMM), Expectation-Maximization, Principal Component Analysis (PCA)" },
      { id: "u5", number: "UNIT V", name: "Ensemble Methods & Model Evaluation", topics: "Bagging, Boosting (AdaBoost, XGBoost), Random Forests, Cross-validation, Precision-Recall, ROC-AUC curves" },
    ],
    "CS-602": [
      { id: "u1", number: "UNIT I", name: "Network Models & Physical Layer", topics: "OSI and TCP/IP reference models, Network topologies, Transmission media, Multiplexing (FDM/TDM), Switching" },
      { id: "u2", number: "UNIT II", name: "Data Link Layer & MAC Sublayer", topics: "Framing, Error detection (CRC, Checksum), Sliding window protocols, CSMA/CD, CSMA/CA, Ethernet standards" },
      { id: "u3", number: "UNIT III", name: "Network Layer & Routing", topics: "IPv4 & IPv6 addressing, Subnetting, CIDR, ARP, RARP, Routing algorithms (Distance Vector, OSPF, BGP), ICMP" },
      { id: "u4", number: "UNIT IV", name: "Transport Layer", topics: "Transport services, TCP connection management, 3-way handshake, Flow control (Sliding window), UDP, Congestion control" },
      { id: "u5", number: "UNIT V", name: "Application Layer & Network Security", topics: "DNS, HTTP, FTP, SMTP, Cryptography basics, Symmetric/Asymmetric ciphers, Firewalls, VPN & TLS/SSL" },
    ],
    "CS-603": [
      { id: "u1", number: "UNIT I", name: "Introduction to Compilers & Lexical Analysis", topics: "Phases of a compiler, Compiler-construction tools, Regular expressions, Lexical token recognition, LEX tool" },
      { id: "u2", number: "UNIT II", name: "Syntax Analysis & Top-Down Parsing", topics: "Context-free grammars, Ambiguity removal, Top-down parsing, Recursive descent, LL(1) parsers, First & Follow sets" },
      { id: "u3", number: "UNIT III", name: "Bottom-Up Parsing", topics: "Shift-reduce parsing, Operator precedence parsing, LR parsers (SLR, Canonical LR, LALR), YACC parser generator" },
      { id: "u4", number: "UNIT IV", name: "Syntax-Directed Translation & Intermediate Code", topics: "Syntax-directed definitions (SDD), Evaluation orders, Three-address code, Quadruples, Triples, Type checking" },
      { id: "u5", number: "UNIT V", name: "Code Optimization & Code Generation", topics: "Principal sources of optimization, Loop optimization, DAG representation of basic blocks, Peephole optimization" },
    ],
    "CS-604": [
      { id: "u1", number: "UNIT I", name: "Graphics Systems & Primitive Generation", topics: "Display technologies (CRT, Flat-panel), Frame buffer, DDA line algorithm, Bresenham’s line & Midpoint circle" },
      { id: "u2", number: "UNIT II", name: "2D Geometric Transformations & Clipping", topics: "Translation, Scaling, Rotation, Matrix representations, Cohen-Sutherland line clipping, Sutherland-Hodgman polygon" },
      { id: "u3", number: "UNIT III", name: "3D Concepts & Transformations", topics: "3D display techniques, 3D translation, rotation, scaling, Parallel & Perspective projections, Viewing pipeline" },
      { id: "u4", number: "UNIT IV", name: "Curves, Surfaces & Hidden Surface Removal", topics: "Bezier and B-Spline curves, Hidden surface elimination: Z-buffer algorithm, Painter's algorithm, Back-face culling" },
      { id: "u5", number: "UNIT V", name: "Illumination Models & Shading", topics: "Ambient, Diffuse and Specular reflection, Phong & Gouraud shading models, Color models (RGB, CMYK, HSV)" },
    ],

    // ─── Semester 7 ───
    "CS-701": [
      { id: "u1", number: "UNIT I", name: "Software Architecture Fundamentals", topics: "Architecture business cycle, Architectural patterns, Reference models, Software quality attributes (Performance, Security)" },
      { id: "u2", number: "UNIT II", name: "Architectural Styles & Patterns", topics: "Data flow systems, Call-and-return architectures, Layered systems, Event-driven systems, Microservices architecture" },
      { id: "u3", number: "UNIT III", name: "Architecture Design & Documentation", topics: "Attribute-Driven Design (ADD), Documenting software architectures, 4+1 View model, Architectural decision records" },
      { id: "u4", number: "UNIT IV", name: "Architectural Evaluation", topics: "Architecture Tradeoff Analysis Method (ATAM), Cost Benefit Analysis Method (CBAM), Software architecture reviews" },
      { id: "u5", number: "UNIT V", name: "Enterprise Architecture & Modern Trends", topics: "Service-Oriented Architecture (SOA), Cloud-native architectures, Serverless design patterns, DevOps integration" },
    ],
    "CS-702": [
      { id: "u1", number: "UNIT I", name: "Deep Neural Networks Fundamentals", topics: "Perceptron to deep feedforward networks, Activation functions (ReLU, Sigmoid, Tanh), Backpropagation algorithm" },
      { id: "u2", number: "UNIT II", name: "Convolutional Neural Networks (CNN)", topics: "Convolution & pooling layers, Padding, Stride, ResNet, VGG, Inception architectures, Applications in computer vision" },
      { id: "u3", number: "UNIT III", name: "Recurrent Neural Networks (RNN)", topics: "Vanishing gradient problem, LSTM networks, Gated Recurrent Units (GRU), Sequence-to-sequence models & Attention" },
      { id: "u4", number: "UNIT IV", name: "Generative Models & Transformers", topics: "Autoencoders, Variational Autoencoders (VAE), Generative Adversarial Networks (GANs), Transformer architecture" },
      { id: "u5", number: "UNIT V", name: "Reinforcement Learning", topics: "Markov Decision Process (MDP), Bellman equations, Value iteration, Q-Learning, Deep Q-Networks (DQN), Policy gradients" },
    ],
    "CS-703": [
      { id: "u1", number: "UNIT I", name: "Classical Encryption & Security Principles", topics: "Confidentiality, Integrity, Availability (CIA), Symmetric vs asymmetric ciphers, Substitution & Transposition ciphers" },
      { id: "u2", number: "UNIT II", name: "Symmetric Key Cryptography", topics: "Block cipher principles, Data Encryption Standard (DES), Advanced Encryption Standard (AES), Cipher block modes" },
      { id: "u3", number: "UNIT III", name: "Public Key Cryptography & Key Exchange", topics: "Modular arithmetic, Prime numbers, Fermat's & Euler's theorems, RSA algorithm, Diffie-Hellman key exchange, ECC" },
      { id: "u4", number: "UNIT IV", name: "Cryptographic Hash Functions & Signatures", topics: "SHA-256, MD5, Message Authentication Codes (HMAC), Digital Signature Standard (DSS), Public Key Infrastructure (PKI)" },
      { id: "u5", number: "UNIT V", name: "Network Security & Defenses", topics: "IPsec architecture, SSL/TLS handshake protocol, PGP email security, Intrusion Detection Systems (IDS), Firewalls" },
    ],
    "CS-704": [
      { id: "u1", number: "UNIT I", name: "Big Data Architecture & Ecosystem", topics: "Characteristics of Big Data (5 V's), Distributed computing challenges, Hadoop architecture, HDFS storage system" },
      { id: "u2", number: "UNIT II", name: "Hadoop MapReduce Framework", topics: "MapReduce programming model, Map, Shuffle and Reduce phases, YARN resource manager, Fault tolerance" },
      { id: "u3", number: "UNIT III", name: "Apache Spark & In-Memory Analytics", topics: "Spark architecture, Resilient Distributed Datasets (RDDs), Spark SQL, DataFrames, Transformations and actions" },
      { id: "u4", number: "UNIT IV", name: "NoSQL Databases", topics: "CAP theorem, BASE properties, Key-Value stores, Columnar databases (HBase), Document stores (MongoDB), Graph databases" },
      { id: "u5", number: "UNIT V", name: "Stream Processing & Big Data Machine Learning", topics: "Real-time streaming with Apache Kafka, Spark Streaming, MLlib for distributed machine learning, Case studies" },
    ],

    // ─── Semester 8 ───
    "CS-801": [
      { id: "u1", number: "UNIT I", name: "Introduction to Internet of Things (IoT)", topics: "IoT definition, Characteristics, Physical & logical design, IoT enabled technologies, M2M vs IoT comparison" },
      { id: "u2", number: "UNIT II", name: "Sensors, Actuators & Microcontrollers", topics: "Sensor classification, Transducers, Actuators, Embedded platforms (Arduino, Raspberry Pi, ESP32/ESP8266)" },
      { id: "u3", number: "UNIT III", name: "IoT Networking Protocols", topics: "IEEE 802.15.4, Zigbee, 6LoWPAN, Bluetooth Low Energy (BLE), LoRaWAN, CoAP, MQTT, REST HTTP architecture" },
      { id: "u4", number: "UNIT IV", name: "IoT Cloud & Edge Analytics", topics: "Cloud storage for IoT, Data analytics at edge vs cloud, AWS IoT / Azure IoT Hub integration, Digital twins" },
      { id: "u5", number: "UNIT V", name: "IoT Security & Smart Applications", topics: "Vulnerabilities in IoT, Device security, Smart cities, Industrial IoT (IIoT), Smart healthcare, Connected vehicles" },
    ],
    "CS-802": [
      { id: "u1", number: "UNIT I", name: "Blockchain Architecture & Cryptography", topics: "Distributed ledger technology, Peer-to-peer networks, Cryptographic hashing (SHA-256), Merkle trees, Digital signatures" },
      { id: "u2", number: "UNIT II", name: "Consensus Mechanisms", topics: "Proof of Work (PoW), Proof of Stake (PoS), Delegated PoS, Practical Byzantine Fault Tolerance (PBFT), Mining process" },
      { id: "u3", number: "UNIT III", name: "Ethereum & Smart Contracts", topics: "Ethereum Virtual Machine (EVM), Solidity programming, Gas mechanics, Smart contract lifecycle, Security pitfalls" },
      { id: "u4", number: "UNIT IV", name: "Enterprise Blockchains", topics: "Hyperledger Fabric architecture, Membership Service Providers (MSP), Chaincode, Permissioned vs permissionless" },
      { id: "u5", number: "UNIT V", name: "Decentralized Applications & Future Trends", topics: "DApps development, Web3 architecture, Decentralized Finance (DeFi), Tokenomics, Scalability (Layer 2 solutions)" },
    ],
    "CS-803": [
      { id: "u1", number: "UNIT I", name: "Cloud Computing Principles & Service Models", topics: "Cloud definition, Essential characteristics, Service models (IaaS, PaaS, SaaS), Deployment models (Public, Private, Hybrid)" },
      { id: "u2", number: "UNIT II", name: "Virtualization Technologies", topics: "Hypervisors (Type 1 & Type 2), CPU, Memory and I/O virtualization, Virtual machines, Containerization vs Virtualization" },
      { id: "u3", number: "UNIT III", name: "Cloud Storage & Resource Management", topics: "Distributed file systems, Object storage (Amazon S3), Elastic resource provisioning, Dynamic load balancing" },
      { id: "u4", number: "UNIT IV", name: "Cloud Security & Governance", topics: "Shared responsibility model, Identity and Access Management (IAM), Data encryption in cloud, Compliance & SLA" },
      { id: "u5", number: "UNIT V", name: "Cloud Native & Serverless Computing", topics: "Docker containers, Kubernetes orchestration, Function-as-a-Service (AWS Lambda), Cloud design patterns" },
    ],
    "CS-804": [
      { id: "u1", number: "UNIT I", name: "Problem Identification & Feasibility Analysis", topics: "Literature review, Problem statement formulation, Technical & economic feasibility, Industry scope" },
      { id: "u2", number: "UNIT II", name: "System Requirements & Specifications", topics: "Hardware and software requirement specifications, Architecture selection, Technology stack finalization" },
      { id: "u3", number: "UNIT III", name: "Design & Implementation", topics: "System architectural design, Database schema, Modular coding, API integrations, Core module development" },
      { id: "u4", number: "UNIT IV", name: "Testing, Verification & Optimization", topics: "Unit testing, Integration testing, Performance benchmarks, Code optimization, Bug tracking & debugging" },
      { id: "u5", number: "UNIT V", name: "Documentation, Deployment & Seminar", topics: "Project report preparation, Research paper writing, Deployment to live environment, Final viva defense" },
    ],
  };

  // Resolve units for currently selected subject code or fallback
  const subjectKey = subject?.code?.toUpperCase();
  const currentUnits = rgpvUnitsMap[subjectKey] || [
    { id: "u1", number: "UNIT I", name: "Fundamentals & Core Concepts", topics: "Basic definitions, Introduction, Mathematical foundations, Core theorems and architecture" },
    { id: "u2", number: "UNIT II", name: "Methods & Algorithmic Analysis", topics: "Key algorithmic techniques, Methodologies, Mathematical formulations, Practical structures" },
    { id: "u3", number: "UNIT III", name: "Intermediate Systems & Applications", topics: "Detailed system design, Standard methods, Real-world applications and structural models" },
    { id: "u4", number: "UNIT IV", name: "Advanced Optimization & Design", topics: "Advanced design patterns, Performance optimization, Analytical frameworks and evaluation" },
    { id: "u5", number: "UNIT V", name: "Emerging Technologies & Case Studies", topics: "Current industry trends, Case studies, Advanced implementations and standard practices" },
  ];

  const filteredUnits = currentUnits.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.topics.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    if (onSelectUnit) {
      onSelectUnit(unit);
    }
  };

  const displayName = user?.displayName || "Student User";
  const displayEmail = user?.email || "student@eduvault.io";
  const userInitial = displayName.charAt(0).toUpperCase() || "S";

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#f8fafd] text-slate-800"} flex flex-col font-sans transition-colors duration-200`}>
      {/* ─── Top Navbar ─── */}
      <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-30 transition-colors ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
      }`}>
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-0.5 text-xl tracking-tight cursor-pointer focus:outline-none"
            title="Return to Dashboard"
          >
            <span className={`font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Edu</span>
            <span className="font-extrabold text-[#0284c7]">Vault</span>
          </button>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-lg mx-6 hidden sm:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search units in ${subject.code || "subject"} (e.g. Unit I, Water, Trees)...`}
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 ${
                isDarkMode
                  ? "bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-400 focus:bg-slate-800"
                  : "bg-white border border-slate-200 text-slate-700 placeholder-slate-400 shadow-xs focus:border-[#0284c7]/50"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              isDarkMode
                ? "border-slate-700 text-amber-300 hover:bg-slate-800"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User profile avatar / dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center h-8 w-8 rounded-full overflow-hidden border border-slate-300 ring-2 ring-transparent hover:ring-[#0284c7]/40 transition-all cursor-pointer bg-slate-900 text-white"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xs font-bold">{userInitial}</span>
              )}
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className={`absolute right-0 mt-2 w-56 rounded-xl border py-2 shadow-xl z-50 animate-fade-in ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-100 text-slate-800"
              }`}>
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateToHome?.();
                  }}
                  className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home Page
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main Shell: Left Sidebar + Content Area ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className={`w-64 border-r hidden md:flex flex-col justify-between p-4 transition-colors ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <div className="space-y-6">
            {/* Main Navigation links */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Navigation</p>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    onNavigateToDashboard();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-[#e0f2fe] text-[#0284c7] dark:text-sky-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("courses");
                    onNavigateToCourses?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "courses"
                      ? "bg-[#e0f2fe] text-[#0284c7] dark:text-sky-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  <span>Courses</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("branches");
                    onNavigateToBranch?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "branches"
                      ? "bg-[#e0f2fe] text-[#0284c7] dark:text-sky-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Branches</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("semesters");
                    onNavigateToSemester?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "semesters"
                      ? "bg-[#e0f2fe] text-[#0284c7] dark:text-sky-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Semesters</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("subjects");
                    onNavigateToSubject?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "subjects"
                      ? "bg-[#e0f2fe] text-[#0284c7] dark:text-sky-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Subjects</span>
                </button>
              </nav>
            </div>

            {/* Quick Actions */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Options</p>
              <div className="space-y-1">
                <button
                  onClick={onNavigateToFeedback}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>Rate & Feedback</span>
                </button>

                <button
                  onClick={onNavigateToSettings}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick jump navigation footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <button
              onClick={onNavigateToResources}
              className="w-full flex items-center gap-2 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Resources</span>
            </button>

            <button
              onClick={onNavigateToSubject}
              className="w-full flex items-center gap-2 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Change Subject</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-8">
          {/* Breadcrumb Steps */}
          <div className="flex flex-wrap items-center gap-2 text-xs mb-6">
            <button
              onClick={onNavigateToDashboard}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              {university.code || "University"}
            </button>
            <span className="text-slate-300">›</span>
            <button
              onClick={onNavigateToCourses}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              {course.code || "Course"}
            </button>
            <span className="text-slate-300">›</span>
            <button
              onClick={onNavigateToBranch}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              {branch.code || "Branch"}
            </button>
            <span className="text-slate-300">›</span>
            <button
              onClick={onNavigateToSemester}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              {semester.name || "Semester"}
            </button>
            <span className="text-slate-300">›</span>
            <button
              onClick={onNavigateToSubject}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              {subject.code || subject.name || "Subject"}
            </button>
            <span className="text-slate-300">›</span>
            <button
              onClick={onNavigateToResources}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              Resources
            </button>
            <span className="text-slate-300">›</span>
            <span className="bg-[#e0f2fe] text-[#0284c7] font-bold px-3 py-1 rounded-full shadow-xs">
              Handwritten Notes
            </span>
          </div>

          {/* Selected Path Banner Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-900/50 bg-[#e0f2fe]/60 px-4 py-1.5 mb-6 text-xs text-[#0284c7] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse" />
            <span>
              {university.code} • {course.code} • {branch.code} • {semester.name} • {subject.code ? `${subject.code} - ` : ""}{subject.name} • Handwritten Notes
            </span>
          </div>

          {/* Section Heading */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Select Unit
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choose a unit to view handwritten notes and study material.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToResources}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs hover:border-[#0284c7] hover:bg-[#e0f2fe]/30 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#0284c7] transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Resources</span>
              </button>
            </div>
          </div>

          {/* Empty search state */}
          {filteredUnits.length === 0 && (
            <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No units match "{searchQuery}"</h3>
              <p className="text-xs text-slate-400 mt-1">Try searching with a different unit keyword.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-[#0284c7] text-white text-xs font-semibold rounded-xl hover:bg-[#0369a1] transition-all cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* ─── Unit Cards Grid (Medium Card Size with Unit Number & Exact Name) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 max-w-5xl">
            {filteredUnits.map((u) => (
              <div
                key={u.id}
                onClick={() => handleUnitClick(u)}
                className={`group relative rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer min-h-[125px] sm:min-h-[135px] ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 hover:border-[#0284c7]/50 hover:bg-slate-850/80"
                    : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-[#0284c7]/40 hover:-translate-y-0.5"
                } ${
                  selectedUnit?.id === u.id ? "ring-2 ring-[#0284c7] border-[#0284c7]" : ""
                }`}
              >
                <span className="text-[11px] font-black tracking-wider uppercase text-[#0284c7] bg-sky-50 dark:text-sky-300 px-3 py-1 rounded-md border border-sky-200/60 dark:border-sky-800/60 mb-2.5">
                  {u.number}
                </span>

                <h2
                  className={`text-base font-bold tracking-tight transition-colors line-clamp-2 ${
                    isDarkMode
                      ? "text-white group-hover:text-[#38bdf8]"
                      : "text-slate-800 group-hover:text-[#0284c7]"
                  }`}
                >
                  {u.name}
                </h2>

                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {u.topics}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
