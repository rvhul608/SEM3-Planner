// ============================================================
// DATA MODEL — Rvhul's Sem 3 Almanac
// ============================================================

const SEMESTER_START = new Date(2026, 5, 22); // 22 Jun 2026
const TODAY_OVERRIDE = null; // set to a Date for testing, else null = real today

const PERIODS = [
  { n: 1, label: "9:00", start: "09:00", end: "09:50" },
  { n: 2, label: "9:50", start: "09:50", end: "10:40" },
  { n: 3, label: "10:50", start: "10:50", end: "11:40" },
  { n: 4, label: "11:40", start: "11:40", end: "12:30" },
  { n: 5, label: "12:30", start: "12:30", end: "13:20" },
  { n: 6, label: "1:20", start: "13:20", end: "14:10" },
  { n: 7, label: "2:10", start: "14:10", end: "15:00" },
  { n: 8, label: "3:10", start: "15:10", end: "16:00" },
  { n: 9, label: "4:00", start: "16:00", end: "16:50" },
];

const COURSES = {
  DSA:   { name: "Data Structures & Algorithms", code: "23CSE203", color: "teal" },
  DBMS:  { name: "Database Management Systems",  code: "23CSE202", color: "blue" },
  C:     { name: "Procedural Programming (C)",   code: "23CSE201", color: "amber" },
  OPT:   { name: "Optimization Techniques",       code: "23MAT206", color: "purple" },
  DE:    { name: "Digital Electronics",           code: "23ECE205", color: "coral" },
  DELAB: { name: "Digital Electronics Lab",        code: "23ECE285", color: "coral" },
  LS:    { name: "Life Skills for Engineers I",    code: "23LSE201", color: "gray" },
  ADV:   { name: "Advisory / Admin",               code: "—",        color: "gray" },
  FREE:  { name: "Free period",                    code: "—",        color: "free" },
  LUNCH: { name: "Lunch",                           code: "—",        color: "lunch" },
};

// Weekly timetable. period numbers reference PERIODS array. "span" = how many periods this block occupies.
const TIMETABLE = {
  Mon: [
    { p: 1, span: 1, course: "FREE" },
    { p: 2, span: 1, course: "OPT" },
    { p: 3, span: 1, course: "DSA" },
    { p: 4, span: 1, course: "LUNCH" },
    { p: 5, span: 2, course: "DBMS" },
    { p: 7, span: 3, course: "DELAB" },
  ],
  Tue: [
    { p: 1, span: 2, course: "DSA" },
    { p: 3, span: 1, course: "C" },
    { p: 4, span: 1, course: "LUNCH" },
    { p: 5, span: 1, course: "DBMS" },
    { p: 6, span: 1, course: "LS" },
    { p: 7, span: 1, course: "ADV" },
    { p: 8, span: 2, course: "DE" },
  ],
  Wed: [
    { p: 1, span: 2, course: "OPT" },
    { p: 3, span: 2, course: "C" },
    { p: 5, span: 1, course: "LUNCH" },
    { p: 6, span: 1, course: "DE" },
    { p: 7, span: 1, course: "DSA" },
    { p: 8, span: 1, course: "DSA" },
    { p: 9, span: 1, course: "DBMS" },
  ],
  Thu: [
    { p: 1, span: 1, course: "DBMS" },
    { p: 2, span: 1, course: "LS" },
    { p: 3, span: 1, course: "DBMS" },
    { p: 4, span: 1, course: "LUNCH" },
    { p: 5, span: 1, course: "ADV" },
    { p: 6, span: 1, course: "C" },
    { p: 7, span: 1, course: "OPT" },
    { p: 8, span: 1, course: "DE" },
    { p: 9, span: 1, course: "FREE" },
  ],
  Fri: [
    { p: 1, span: 2, course: "DELAB" },
    { p: 3, span: 1, course: "C" },
    { p: 4, span: 1, course: "LUNCH" },
    { p: 5, span: 1, course: "OPT" },
    { p: 6, span: 2, course: "LS" },
    { p: 8, span: 1, course: "DSA" },
    { p: 9, span: 1, course: "FREE" },
  ],
};

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_KEYS  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Calendar special dates: holidays, exam blocks, milestones (from official AC)
const CALENDAR_EVENTS = [
  { date: "2026-06-22", type: "milestone", title: "Semester begins", note: "Classes start for all senior batches" },
  { date: "2026-06-25", type: "holiday", title: "Muharram" },
  { date: "2026-07-04", type: "holiday", title: "Non-instructional working day" },
  { date: "2026-07-18", type: "milestone", title: "Instructional working day (Saturday)" },
  { date: "2026-08-01", type: "holiday", title: "Non-instructional working day" },
  { date: "2026-08-12", type: "holiday", title: "Karkadaka Vavu" },
  { date: "2026-08-13", type: "exam", title: "Midterm exams begin", note: "Continues through ~Aug 22", endDate: "2026-08-22" },
  { date: "2026-08-15", type: "holiday", title: "Independence Day" },
  { date: "2026-08-22", type: "milestone", title: "Compensatory working day", note: "Makes up for Aug 29 holiday — not a free Saturday" },
  { date: "2026-08-25", type: "holiday", title: "First Onam / Milad i Sherif" },
  { date: "2026-08-26", type: "holiday", title: "Thiruvonam" },
  { date: "2026-08-27", type: "holiday", title: "Third Onam" },
  { date: "2026-08-28", type: "holiday", title: "Fourth Onam / Sree Narayana Guru Jayanthi" },
  { date: "2026-08-29", type: "holiday", title: "Declared holiday" },
  { date: "2026-09-04", type: "holiday", title: "Sreekrishna Jayanthi" },
  { date: "2026-09-21", type: "holiday", title: "Sree Narayana Guru Samadhi Day" },
  { date: "2026-09-27", type: "holiday", title: "Amritavarsham 73" },
  { date: "2026-10-02", type: "holiday", title: "Gandhi Jayanthi" },
  { date: "2026-10-20", type: "holiday", title: "Mahanavami" },
  { date: "2026-10-21", type: "holiday", title: "Vijayadasami" },
  { date: "2026-10-23", type: "exam", title: "Last Working Day", note: "Semester 3 classes end" },
  { date: "2026-10-29", type: "exam", title: "End Semester exams begin", note: "Full academic blackout from here", endDate: "2026-11-21" },
  { date: "2026-11-08", type: "holiday", title: "Deepavali" },
];

// Phases (derived from the brief)
const PHASES = [
  {
    id: 1, range: "22 Jun – 12 Aug", title: "Normal instruction",
    desc: "~7.5 weeks of regular classes before midterms. Best window for the ISRO build, DecideWise rebuild, and getting LFX PRs merged.",
    availability: "high", start: "2026-06-22", end: "2026-08-12"
  },
  {
    id: 2, range: "13 – 22 Aug", title: "Midterm exam window",
    desc: "Low bandwidth for anything outside academics. No new project work, no hackathon prep. DSA, DBMS, C need the most attention.",
    availability: "low", start: "2026-08-13", end: "2026-08-22"
  },
  {
    id: 3, range: "25 – 29 Aug", title: "Onam break",
    desc: "5 consecutive free days. High availability window — good for catch-up, project sprints, or genuine rest after midterms.",
    availability: "high", start: "2026-08-25", end: "2026-08-29"
  },
  {
    id: 4, range: "31 Aug – 19 Oct", title: "Longest stable stretch",
    desc: "Best period for sustained project work alongside classes. Smart Horizon, SIH, and Rapid Rescue integration all fall here.",
    availability: "high", start: "2026-08-31", end: "2026-10-19"
  },
  {
    id: 5, range: "20 – 23 Oct", title: "Compressed final week",
    desc: "Holiday-interrupted (Mahanavami, Vijayadasami). Don't expect full working days. Wrap up loose ends, not start new work.",
    availability: "medium", start: "2026-10-20", end: "2026-10-23"
  },
  {
    id: 6, range: "24 – 28 Oct", title: "Study leave",
    desc: "Only ~5 days before End Sem exams begin. Minimal availability — full revision mode.",
    availability: "low", start: "2026-10-24", end: "2026-10-28"
  },
  {
    id: 7, range: "29 Oct onward", title: "End Semester exams",
    desc: "Assume very low to no availability until exams conclude in late November.",
    availability: "none", start: "2026-10-29", end: "2026-11-21"
  },
];

// ACM SIGAI 21-Day Recruitment Plan — starts June 23
const ACM_START = "2026-06-23";
// Day N date helper (1-indexed)
function acmDay(n) {
  const d = new Date(2026, 5, 22 + n); // Jun 23 = day 1 → Jun 22 + 1
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

// Project / hackathon / fellowship timeline
const TIMELINE = [
  // ── ACM SIGAI RECRUITMENT ──────────────────────────────────
  { date: acmDay(1), end: acmDay(7), type: "acm", title: "ACM SIGAI Week 1 — Self Study", desc: "Kaggle Intro to ML + Intermediate ML (~8 hrs total). Topics: Intro to ML, Data Preprocessing & EDA, Linear Models, Feature Engineering, Tree Models & Ensembles, Hyperparameter Tuning. Pure learning — no deliverables.", tags: ["ACM","Week 1","Kaggle courses"] },
  { date: acmDay(8), end: acmDay(14), type: "acm", title: "ACM SIGAI Week 2 — Individual Tasks", desc: "Topics: ML Pipelines, PCA, Advanced Feature Engineering, SHAP, Model Evaluation, Cascaded Thinking. Mandatory: Feature Engineering Challenge on Santander dataset (improve Logistic Regression Recall 0.83→0.88+, submit code + experiment log + report). Plus one of: Task 1 Regression, Task 2 Classification, or Task 3 Ensemble Study.", tags: ["ACM","Week 2","Deliverables due Day 14"] },
  { date: acmDay(14), type: "deadline", title: "ACM Day 14 — Feature Engineering Challenge due", desc: "Santander dataset — Logistic Regression Recall must reach 0.88+. Submit: code + experiment log + short report. Also submit your chosen individual task (Regression / Classification / Ensemble Study).", tags: ["ACM","Deadline","Don't miss"] },
  { date: acmDay(15), end: acmDay(17), type: "acm", title: "ACM SIGAI Week 3 — Deep Learning self study", desc: "Days 15–17: Neural Networks, Backpropagation, CNNs. Self-study before the team project begins. Also: assemble your 2–3 person team by Day 17 and start scoping the cascaded pipeline.", tags: ["ACM","Week 3","Self study"] },
  { date: acmDay(18), type: "deadline", title: "ACM Day 18 — Pipeline design doc due", desc: "Team project: cascaded ML pipeline (2+ models in sequence). Submit the architecture design document today before building begins. Include model choices, data flow, dataset link, and expected outputs.", tags: ["ACM","Deadline"] },
  { date: acmDay(18), end: acmDay(21), type: "acm", title: "ACM SIGAI Days 18–21 — Team project build", desc: "Build the cascaded ML pipeline with your team (2–3 people). Final deliverables: code, report, architecture diagram, dataset link, and a 10-minute demo video.", tags: ["ACM","Team project"] },
  { date: acmDay(21), type: "deadline", title: "ACM Day 21 — Final project due + interview prep", desc: "Submit: code, report, architecture diagram, dataset link, 10-min demo. After submission, expect an interview. Prepare to walk through your pipeline decisions, SHAP explanations, and why you chose your cascade order.", tags: ["ACM","Final deadline","Interview incoming"] },
  // ── MAIN TIMELINE ─────────────────────────────────────────
  { date: "2026-06-17", end: "2026-06-21", type: "build", title: "DecideWise AI — clean rebuild", desc: "pdfplumber extraction, FastAPI backend, Streamlit UI, three prompt modes (tactical/practical/strategic), deployed to HuggingFace Spaces.", tags: ["Build","~1 week"] },
  { date: "2026-07-01", type: "deadline", title: "ISRO idea submission — hard deadline", desc: "Bharatiya Antariksh Hackathon, Topic #4: Road Extraction & Route Resilience. Written concept only, no prototype needed.", tags: ["Deadline","Don't miss"] },
  { date: "2026-07-01", end: "2026-07-20", type: "fellowship", title: "Find LFX open source repos", desc: "Projects list drops Jul 1. Identify target CNCF repo (NetworkX, OSMnx, FastAPI ecosystem). Submit 2–3 PRs. Must be merged before Aug 3.", tags: ["Critical path","Start immediately"] },
  { date: "2026-07-01", end: "2026-10-23", type: "dsa", title: "DSA — daily practice alongside coursework", desc: "Whatever topic is taught in class that week, practice those problems that evening. NeetCode 150 / Striver SDE sheet. 1 hr/day minimum.", tags: ["Daily habit"] },
  { date: "2026-07-01", end: "2026-08-12", type: "build", title: "Rapid Rescue — Docker + cleanup", desc: "Add Docker layer, clean FastAPI + YOLOv8 inference, proper git history, push to clean repo.", tags: ["Build","Evenings"] },
  { date: "2026-07-20", type: "deadline", title: "ISRO shortlist announced + InnovaHack register", desc: "If shortlisted, prepare for induction Jul 21. Either way, register InnovaHack Chapter 1 today (GenAI track, low effort).", tags: ["Deadline"] },
  { date: "2026-07-21", type: "hackathon", title: "ISRO induction", desc: "If shortlisted: Cartosat-3 data access released. Attend induction session.", tags: ["Hackathon"] },
  { date: "2026-07-21", end: "2026-08-05", type: "build", title: "ISRO build window — highest intensity", desc: "U-Net segmentation on SpaceNet Roads, skeletonization, NetworkX graph, betweenness centrality, Streamlit dashboard. Fine-tune on Cartosat. Classes running simultaneously.", tags: ["Primary focus","⚠ Tight"] },
  { date: "2026-07-27", type: "hackathon", title: "HSBC Hackathon", desc: "Free day only, no prep. Finance domain. Skip if ISRO build is behind schedule.", tags: ["Optional"] },
  { date: "2026-07-30", end: "2026-08-18", type: "fellowship", title: "LFX application window", desc: "CNCF: Aug 3–18. Meshery: Jul 30–Aug 12. PRs must be merged before applying. Reviewed Aug 19–Sep 1, notifications Sep 2–4.", tags: ["Fellowship","PRs must be ready"] },
  { date: "2026-08-06", end: "2026-08-07", type: "hackathon", title: "ISRO Grand Finale", desc: "30-hour in-person build. Bring a working pipeline — don't train from scratch here. Polish, integrate, present.", tags: ["Hackathon"] },
  { date: "2026-08-12", end: "2026-08-18", type: "fellowship", title: "MLH Fellowship — apply", desc: "Rolling admissions. Apply as soon as ISRO is done. Open Source track. Code walkthrough interview — own every line submitted.", tags: ["Fellowship","Apply early"] },
  { date: "2026-08-13", end: "2026-08-22", type: "exam", title: "Midterm exams", desc: "All project work, PRs, and hackathon prep pause here. Full academic focus. DSA and C need the most attention as newer subjects.", tags: ["⚠ Blackout"] },
  { date: "2026-08-25", end: "2026-08-29", type: "milestone", title: "Onam break", desc: "5 days. Recover, replan, catch up on anything that slipped during midterms.", tags: ["Break"] },
  { date: "2026-09-03", end: "2026-09-05", type: "hackathon", title: "Smart Horizon Bangalore", desc: "48-hour in-person. AI/smart cities track. Rapid Rescue + ISRO road graph as routing layer = strongest possible submission. College days during semester — arrange permission in advance.", tags: ["Hackathon","Permission needed"] },
  { date: "2026-09-06", type: "deadline", title: "SIH 2026 — national deadline", desc: "Team of 6. College internal round around August. Form team now. ISRO/gov problem statements likely to appear.", tags: ["Deadline"] },
  { date: "2026-09-07", end: "2026-11-27", type: "fellowship", title: "LFX Mentorship program — if selected", desc: "~20 hrs/week alongside semester 3. Midterm evaluation Oct 20. Overlaps with end-sem prep — plan carefully.", tags: ["If selected"] },
  { date: "2026-09-01", end: "2026-10-19", type: "build", title: "Road graph → Rapid Rescue integration", desc: "Connect ISRO criticality graph to Rapid Rescue routing layer: accident location → flagged junction → Dijkstra alternate route → Telegram alert with route.", tags: ["Build"] },
  { date: "2026-10-23", type: "exam", title: "Last Working Day", desc: "All project work, PRs, and hackathon prep must wrap up or pause. Full end-sem revision mode begins.", tags: ["⚠ Wrap up"] },
  { date: "2026-10-29", end: "2026-11-21", type: "exam", title: "End Semester exams", desc: "Complete blackout. DSA (5cr), DBMS, C, Optimization Techniques, Digital Electronics all need strong scores.", tags: ["⚠ Blackout"] },
  { date: "2026-12-01", end: "2026-12-31", type: "dsa", title: "Start C++ for Samsung Parichay", desc: "30 mins/day. C from sem 3 and Java OOP from sem 2 transfer well. Focus on pointers and memory first.", tags: ["Learning"] },
  { date: "2026-12-01", end: "2026-12-31", type: "fellowship", title: "Internshala / LinkedIn — startup applications", desc: "Best window for off-campus applications. Target Kerala and Bangalore AI/ML startups with your GitHub portfolio.", tags: ["Internship","High probability"] },
  { date: "2027-02-01", type: "hackathon", title: "Samsung Parichay", desc: "C++ focused. OOP from Java + C from sem 3 gives a solid foundation.", tags: ["Hackathon"] },
  { date: "2027-01-01", end: "2027-03-31", type: "fellowship", title: "ISRO IIRS internship — apply by Mar 31", desc: "For summer 2027 placement (May–July). ISRO hackathon performance is your differentiator. Needs NOC/bonafide letter from Amrita.", tags: ["Apply Mar 31"] },
  { date: "2027-01-01", end: "2027-03-31", type: "fellowship", title: "GSoC + ESoC 2027 — apply", desc: "With LFX experience + merged PRs + ISRO + Rapid Rescue, a realistic candidate. Target ML/CV adjacent orgs. Engage with community from January.", tags: ["Fellowship"] },
  { date: "2027-05-01", type: "milestone", title: "End of second year — portfolio complete", desc: "Rapid Rescue (full pipeline), ISRO road graph, DecideWise rebuilt, LFX or MLH fellowship, 3+ merged OSS PRs, consistent DSA habit, ISRO internship application submitted.", tags: ["Milestone"] },
];

const TIMELINE_TYPES = {
  build:      { label: "Build",       color: "blue" },
  hackathon:  { label: "Hackathon",   color: "teal" },
  deadline:   { label: "Deadline",    color: "amber" },
  fellowship: { label: "Fellowship",  color: "coral" },
  dsa:        { label: "DSA/Learn",   color: "purple" },
  exam:       { label: "Exam",        color: "red" },
  milestone:  { label: "Milestone",   color: "gray" },
  acm:        { label: "ACM SIGAI",   color: "clay" },
};

const INTERNSHIPS = [
  {
    rank: 1, name: "LFX Mentorship — CNCF Fall 2026", type: "Paid fellowship · Remote · Linux Foundation",
    apply: "Aug 3–18, 2026", runs: "Sept 7 – Nov 27", stipend: "~$3,000 USD", commitment: "~20 hrs/week",
    probability: 55, color: "teal",
    desc: "Your best realistic shot at a paid fellowship this year. CNCF projects span Python, ML pipelines, observability, and cloud-native tooling — all adjacent to your stack. The key requirement is 2–3 merged PRs in relevant repos before the application window opens Aug 3. Projects list drops July 1 — start finding your target project immediately. Note: Sept–Nov overlaps with semester 3 end-sem period — check project time commitment carefully before applying.",
    badges: ["Highest priority", "Need PRs by Aug 3"]
  },
  {
    rank: 2, name: "MLH Fellowship — Open Source Track", type: "Paid fellowship · Remote · Major League Hacking",
    apply: "Rolling · Fall batch", runs: "12 weeks", stipend: "~$5,000 USD", commitment: "Code walkthrough interview",
    probability: 40, color: "blue",
    desc: "Rolling admissions — apply early, don't wait for a deadline. The Open Source track fits your profile best: a code walkthrough where you explain every line, so you must own what you submit. Rapid Rescue (FastAPI + YOLOv8) is your strongest submission piece. Apply once DecideWise and Rapid Rescue are both cleaned up — roughly late July or August.",
    badges: ["Apply August", "Code walkthrough prep needed"]
  },
  {
    rank: 3, name: "ISRO IIRS External Student Internship", type: "Unpaid · In-person · ISRO Indian Institute of Remote Sensing",
    apply: "Deadline 31 Mar every year", runs: "Summer (May–Jul)", stipend: "Unpaid + certificate", commitment: "Min 45 days",
    probability: 60, color: "coral",
    desc: "Your sleeper opportunity. If you get shortlisted or place well at the Bharatiya Antariksh Hackathon, you have a direct narrative hook: built a road extraction and graph resilience system for ISRO's own problem statement. Apply by March 31, 2027 for summer 2027 placement. IIRS Dehradun focuses on remote sensing and geospatial AI — directly relevant to Topic #4. Unpaid but the ISRO certificate carries real weight in India.",
    badges: ["Apply March 2027", "Boosted by hackathon performance"]
  },
  {
    rank: 4, name: "Internshala / LinkedIn — AI/ML startup internships", type: "Paid (₹5k–15k/mo) · Remote or hybrid · Rolling",
    apply: "Year-round rolling", runs: "1–6 months", stipend: "₹5,000–15,000/mo", commitment: "Best window Dec 2026–Jan 2027",
    probability: 70, color: "purple",
    desc: "Highest raw probability but lowest prestige. Kerala and Bangalore AI startups hire second-year students with real GitHub portfolios year-round. By December 2026 you'll have Rapid Rescue, DecideWise, and the ISRO road graph project — a genuinely strong profile for a startup ML intern role. Target Bangalore-based CV and MLOps startups via Internshala, LinkedIn, Wellfound.",
    badges: ["Best shot Dec 2026", "Target Bangalore AI startups"]
  },
  {
    rank: 5, name: "GSoC 2027 — Google Summer of Code", type: "Paid stipend · Remote · Google + open source orgs",
    apply: "~March 2027", runs: "May–Sept 2027", stipend: "~$3,000 USD", commitment: "~30 hrs/week",
    probability: 30, color: "amber",
    desc: "2027 target, not this year. Significantly more competitive than LFX. Probability jumps considerably with LFX Fall 2026 on record — proves you can contribute to open source professionally. Target OpenCV, PyTorch, scikit-learn, CNCF, or NumFOCUS. Engage with your target org's community from January 2027 — proposals from active community members get selected far more often.",
    badges: ["2027 target", "LFX experience multiplies probability"]
  },
  {
    rank: 6, name: "ESoC 2027 — EOS Summer of Code", type: "Paid stipend · Remote · EOS Foundation",
    apply: "~Jan–Feb 2027", runs: "~May–Aug 2027", stipend: "Stipend-based", commitment: "Lower competition than GSoC",
    probability: 45, color: "gray",
    desc: "Lower competition than GSoC but similar structure. Good backup to apply simultaneously with GSoC in early 2027. By then your portfolio (ISRO + Rapid Rescue + LFX + merged PRs) makes you a credible applicant.",
    badges: ["2027 target", "Apply alongside GSoC"]
  },
];

const DSA_PHASES = [
  {
    title: "Phase 1 · July", topics: [
      { id: "arrays", name: "Arrays, Strings, Two Pointers", desc: "Foundation of everything. Target 3 problems/day, Easy → Medium. By end of July, solve any array/string Easy in under 20 minutes." },
      { id: "recursion", name: "Recursion and Sorting", desc: "Merge sort, quick sort, recursion trees. Directly maps to your DSA course content. Bridge between arrays and harder topics." },
    ]
  },
  {
    title: "Phase 2 · August (pre-midterm)", topics: [
      { id: "linkedlist", name: "Linked Lists, Stacks, Queues", desc: "Classic DSA course content. Your C course helps here — pointer manipulation maps directly to linked list implementation." },
    ]
  },
  {
    title: "Phase 3 · September – October", topics: [
      { id: "trees", name: "Trees and Binary Search Trees", desc: "DFS, BFS, level order traversal, height, diameter. Connects to the NetworkX graph work in your ISRO project." },
      { id: "graphs", name: "Graphs", desc: "BFS/DFS, shortest paths (Dijkstra, Bellman-Ford), cycle detection, topological sort. You already used NetworkX for betweenness centrality in ISRO." },
      { id: "hashing", name: "Hashing and Heaps", desc: "HashMap internals, collision handling, priority queues. Comes up constantly in interview questions." },
      { id: "dp1d", name: "Dynamic Programming — 1D start", desc: "Climbing stairs, house robber, coin change. Don't start with 2D DP. Begin in September so you have time before end-sems." },
    ]
  },
  {
    title: "Phase 4 · Post end-sem (Dec onward)", topics: [
      { id: "backtrack", name: "Backtracking, Sliding Window, Binary Search", desc: "Completes your interview-ready toolkit. Target: solve 5 problems per topic." },
      { id: "dp2d", name: "2D DP + Advanced Graphs", desc: "LCS, LIS, grid DP. MST, union-find, Kruskal/Prim. Topics that separate you in competitive rounds by third year." },
    ]
  },
];