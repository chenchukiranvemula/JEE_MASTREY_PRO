/* =========================================================
   JEE MASTREY PRO
   PHASE 3 — AI PRACTICE ENGINE
   ---------------------------------------------------------
   PYQ ENGINE IS INTENTIONALLY DISABLED.
   PYQs will be added later as a separate update.

   AI endpoint expected:
   POST /api/generate-test

   Request:
   {
      exam,
      mode,
      subject,
      difficulty,
      questionCount
   }

   Response:
   {
      questions: [
        {
          id,
          subject,
          chapter,
          question,
          options: ["...", "...", "...", "..."],
          answer: 0,
          explanation: "...",
          concept: "..."
        }
      ]
   }
========================================================= */

(function () {

    "use strict";

    /* =====================================================
       STATE
    ===================================================== */

    const P3 = {

        exam: "jee",

        mode: "mock",

        subject: "all",

        difficulty: "mixed",

        questionCount: 20,

        questions: [],

        answers: [],

        currentQuestion: 0,

        remainingSeconds: 60 * 60,

        timerInterval: null,

        testStarted: false,

        generatedByAI: false

    };


    /* =====================================================
       DOM
    ===================================================== */

    const $ = (id) => document.getElementById(id);

    const practicePage = $("practicePage");
    const practiceContent = $("practiceContent");

    const startMockBtn = $("startMockBtn");
    const topicPracticeBtn = $("topicPracticeBtn");
    const pyqBtn = $("pyqBtn");
    const importantPracticeBtn = $("importantPracticeBtn");

    const testModal = $("testModal");
    const closeTest = $("closeTest");

    const testArea = $("testArea");
    const testExam = $("testExam");
    const timer = $("timer");


    /* =====================================================
       EXAM CONFIGURATION

       IMPORTANT:
       NEET = Physics + Chemistry + BIOLOGY
       JEE  = Physics + Chemistry + Mathematics
    ===================================================== */

    const EXAMS = {

        jee: {
            name: "JEE",
            subjects: [
                "Physics",
                "Chemistry",
                "Mathematics"
            ],
            duration: 180 * 60
        },

        neet: {
            name: "NEET",
            subjects: [
                "Physics",
                "Chemistry",
                "Biology"
            ],
            duration: 200 * 60
        },

        ca: {
            name: "CA",
            subjects: [
                "Accounting",
                "Business Studies",
                "Economics",
                "Law"
            ],
            duration: 180 * 60
        }

    };


    /* =====================================================
       SUBJECT DATA
    ===================================================== */

    const SUBJECT_DATA = {

        Physics: [
            "Units and Measurements",
            "Kinematics",
            "Laws of Motion",
            "Work Energy and Power",
            "Rotational Motion",
            "Gravitation",
            "Properties of Solids and Liquids",
            "Thermodynamics",
            "Kinetic Theory",
            "Oscillations",
            "Waves",
            "Electrostatics",
            "Current Electricity",
            "Magnetic Effects of Current",
            "Electromagnetic Induction",
            "Optics",
            "Dual Nature",
            "Atoms and Nuclei",
            "Electronic Devices"
        ],

        Chemistry: [
            "Some Basic Concepts of Chemistry",
            "Atomic Structure",
            "Chemical Bonding",
            "Thermodynamics",
            "Equilibrium",
            "Redox Reactions",
            "Electrochemistry",
            "Chemical Kinetics",
            "Solutions",
            "Periodic Classification",
            "Coordination Compounds",
            "Organic Chemistry",
            "Hydrocarbons",
            "Haloalkanes",
            "Alcohols Phenols and Ethers",
            "Aldehydes Ketones",
            "Amines",
            "Biomolecules"
        ],

        Mathematics: [
            "Sets Relations and Functions",
            "Complex Numbers",
            "Quadratic Equations",
            "Sequences and Series",
            "Permutations and Combinations",
            "Binomial Theorem",
            "Matrices and Determinants",
            "Limits Continuity and Differentiability",
            "Integral Calculus",
            "Differential Equations",
            "Coordinate Geometry",
            "Vector Algebra",
            "Three Dimensional Geometry",
            "Statistics",
            "Probability"
        ],

        Biology: [
            "The Living World",
            "Biological Classification",
            "Plant Kingdom",
            "Animal Kingdom",
            "Morphology of Flowering Plants",
            "Anatomy of Flowering Plants",
            "Cell Structure and Function",
            "Biomolecules",
            "Cell Cycle",
            "Photosynthesis",
            "Respiration in Plants",
            "Plant Growth and Development",
            "Human Physiology",
            "Reproduction",
            "Genetics",
            "Evolution",
            "Human Health and Disease",
            "Biotechnology",
            "Ecology",
            "Biodiversity"
        ],

        Accounting: [
            "Accounting Fundamentals",
            "Journal",
            "Ledger",
            "Trial Balance",
            "Financial Statements",
            "Partnership",
            "Company Accounts"
        ],

        "Business Studies": [
            "Nature of Business",
            "Principles of Management",
            "Business Environment",
            "Planning",
            "Organising",
            "Staffing",
            "Directing",
            "Controlling",
            "Marketing"
        ],

        Economics: [
            "Introduction to Economics",
            "Demand and Supply",
            "Production",
            "Market Structures",
            "National Income",
            "Money and Banking",
            "Public Finance"
        ],

        Law: [
            "Indian Contract Act",
            "Sale of Goods",
            "Partnership",
            "Companies",
            "Negotiable Instruments"
        ]

    };


    /* =====================================================
       SAFE EXAM DETECTION
    ===================================================== */

    function getCurrentExam() {

        const value =
            localStorage.getItem("masteryExam") ||
            localStorage.getItem("selectedExam") ||
            localStorage.getItem("exam") ||
            "jee";

        return EXAMS[value] ? value : "jee";
    }


    function syncExam() {

        P3.exam = getCurrentExam();

        const exam = EXAMS[P3.exam];

        if (testExam) {
            testExam.textContent = exam.name;
        }
    }


    /* =====================================================
       INIT
    ===================================================== */

    function initPhase3() {

        syncExam();

        if (startMockBtn) {
            startMockBtn.addEventListener(
                "click",
                openMockConfiguration
            );
        }

        if (topicPracticeBtn) {
            topicPracticeBtn.addEventListener(
                "click",
                openTopicPractice
            );
        }

        if (importantPracticeBtn) {
            importantPracticeBtn.addEventListener(
                "click",
                openImportantPractice
            );
        }

        if (pyqBtn) {
            pyqBtn.addEventListener(
                "click",
                showPYQUpdate
            );
        }

        if (closeTest) {
            closeTest.addEventListener(
                "click",
                closeTestModal
            );
        }

        document.addEventListener(
            "click",
            handleDynamicClick
        );

    }


    /* =====================================================
       OPEN MOCK CONFIGURATION
    ===================================================== */

    function openMockConfiguration() {

        syncExam();

        const exam = EXAMS[P3.exam];

        testModal.classList.remove("hidden");

        testArea.innerHTML = `

            <div class="p3-test-intro">

                <div class="p3-ai-orb">
                    ✦
                </div>

                <h2>
                    AI Mock Test
                </h2>

                <p>
                    A fresh test generated for your
                    selected exam. Questions are created
                    for this test and are not taken from
                    the PYQ database.
                </p>

            </div>


            <div class="p3-config">

                <div class="p3-config-section">

                    <span class="p3-config-label">
                        TEST TYPE
                    </span>

                    <div class="p3-choice-grid">

                        <button
                            class="p3-choice active"
                            data-config="mode"
                            data-value="mock"
                        >
                            <strong>Full Mock</strong>
                            <small>Complete exam simulation</small>
                        </button>

                        <button
                            class="p3-choice"
                            data-config="mode"
                            data-value="subject"
                        >
                            <strong>Subject Mock</strong>
                            <small>Focus on one subject</small>
                        </button>

                    </div>

                </div>


                <div
                    class="p3-config-section"
                    id="subjectConfig"
                    style="display:none"
                >

                    <span class="p3-config-label">
                        SUBJECT
                    </span>

                    <div
                        class="p3-choice-grid"
                        id="subjectChoices"
                    >
                    </div>

                </div>


                <div class="p3-config-section">

                    <span class="p3-config-label">
                        DIFFICULTY
                    </span>

                    <div class="p3-choice-grid">

                        <button
                            class="p3-choice active"
                            data-config="difficulty"
                            data-value="mixed"
                        >
                            <strong>Mixed</strong>
                            <small>Balanced difficulty</small>
                        </button>

                        <button
                            class="p3-choice"
                            data-config="difficulty"
                            data-value="hard"
                        >
                            <strong>Hard</strong>
                            <small>Advanced challenge</small>
                        </button>

                    </div>

                </div>


                <div class="p3-config-section">

                    <span class="p3-config-label">
                        QUESTIONS
                    </span>

                    <div class="p3-choice-grid">

                        <button
                            class="p3-choice active"
                            data-config="count"
                            data-value="20"
                        >
                            <strong>20 Questions</strong>
                            <small>Quick mock</small>
                        </button>

                        <button
                            class="p3-choice"
                            data-config="count"
                            data-value="50"
                        >
                            <strong>50 Questions</strong>
                            <small>Long practice</small>
                        </button>

                    </div>

                </div>


                <button
                    class="p3-submit-btn"
                    id="generateAIMock"
                    type="button"
                >
                    ✦ GENERATE AI MOCK TEST
                </button>

            </div>
        `;

        buildSubjectChoices(exam.subjects);
    }


    /* =====================================================
       SUBJECT CHOICES
    ===================================================== */

    function buildSubjectChoices(subjects) {

        const box = $("subjectChoices");

        if (!box) return;

        box.innerHTML = subjects.map(
            (subject, index) => `

                <button
                    class="p3-choice ${index === 0 ? "active" : ""}"
                    data-config="subject"
                    data-value="${escapeHTML(subject)}"
                >

                    <strong>
                        ${escapeHTML(subject)}
                    </strong>

                    <small>
                        AI generated
                    </small>

                </button>
            `
        ).join("");

        P3.subject = subjects[0];
    }


    /* =====================================================
       DYNAMIC CLICK HANDLER
    ===================================================== */

    function handleDynamicClick(event) {

        const button =
            event.target.closest(
                "[data-config]"
            );

        if (button) {

            const config =
                button.dataset.config;

            const value =
                button.dataset.value;

            document
                .querySelectorAll(
                    `[data-config="${config}"]`
                )
                .forEach(
                    el => el.classList.remove("active")
                );

            button.classList.add("active");

            if (config === "mode") {

                P3.mode = value;

                const subjectBox =
                    $("subjectConfig");

                if (subjectBox) {

                    subjectBox.style.display =
                        value === "subject"
                            ? "block"
                            : "none";

                }

            }

            if (config === "subject") {
                P3.subject = value;
            }

            if (config === "difficulty") {
                P3.difficulty = value;
            }

            if (config === "count") {
                P3.questionCount =
                    Number(value);
            }

            return;
        }


        if (
            event.target.closest(
                "#generateAIMock"
            )
        ) {

            generateAIMock();

            return;
        }


        if (
            event.target.closest(
                "[data-answer]"
            )
        ) {

            selectAnswer(
                Number(
                    event.target.closest(
                        "[data-answer]"
                    ).dataset.answer
                )
            );

            return;
        }


        if (
            event.target.closest(
                "#nextQuestion"
            )
        ) {

            nextQuestion();

            return;
        }


        if (
            event.target.closest(
                "#previousQuestion"
            )
        ) {

            previousQuestion();

            return;
        }


        if (
            event.target.closest(
                "#submitTest"
            )
        ) {

            submitTest();

            return;
        }


        if (
            event.target.closest(
                "#restartAIMock"
            )
        ) {

            openMockConfiguration();

            return;
        }

    }


    /* =====================================================
       AI GENERATION
    ===================================================== */

    async function generateAIMock() {

        const button =
            $("generateAIMock");

        if (button) {

            button.disabled = true;

            button.textContent =
                "✦ GENERATING FRESH QUESTIONS...";

        }

        showLoading();

        const payload = {

            exam: P3.exam,

            mode: P3.mode,

            subject:
                P3.mode === "subject"
                    ? P3.subject
                    : "all",

            allowedSubjects:
                EXAMS[P3.exam].subjects,

            difficulty: P3.difficulty,

            questionCount:
                P3.questionCount,

            requirements: {

                originalQuestions: true,

                noPYQ: true,

                noRepeatedQuestions: true,

                detailedSolutions: true,

                conceptExplanation: true,

                examRelevant: true

            }

        };


        try {

            const response =
                await fetch(
                    "/api/generate-test",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(payload)
                    }
                );


            if (!response.ok) {
                throw new Error(
                    "AI server unavailable"
                );
            }


            const data =
                await response.json();


            if (
                !data ||
                !Array.isArray(
                    data.questions
                ) ||
                data.questions.length === 0
            ) {

                throw new Error(
                    "AI returned no questions"
                );

            }


            P3.questions =
                normalizeQuestions(
                    data.questions
                );

            P3.generatedByAI = true;

            startGeneratedTest();

        }
        catch (error) {

            console.error(
                "AI Mock Error:",
                error
            );

            showAIConnectionMessage();

        }
        finally {

            if (button) {

                button.disabled = false;

                button.textContent =
                    "✦ GENERATE AI MOCK TEST";

            }

        }

    }


    /* =====================================================
       LOADING
    ===================================================== */

    function showLoading() {

        testArea.innerHTML = `

            <div class="p3-test-intro">

                <div class="p3-ai-orb">
                    ✦
                </div>

                <h2>
                    Building your test...
                </h2>

                <p>
                    MASTREY AI is creating fresh
                    ${P3.exam.toUpperCase()} questions.
                </p>

                <p>
                    PYQs are not being used.
                </p>

            </div>

        `;
    }


    function showAIConnectionMessage() {

        testArea.innerHTML = `

            <div class="p3-test-intro">

                <div class="p3-ai-orb">
                    ⚡
                </div>

                <h2>
                    AI Engine Not Connected
                </h2>

                <p>
                    The Phase 3 interface is ready,
                    but the secure AI backend
                    is not connected yet.
                </p>

                <p>
                    We will connect the AI backend
                    separately. Your API key should
                    never be placed inside this file.
                </p>

                <button
                    class="p3-submit-btn"
                    id="restartAIMock"
                    type="button"
                >
                    ← BACK TO AI MOCK SETUP
                </button>

            </div>

        `;
    }


    /* =====================================================
       NORMALIZE QUESTIONS
    ===================================================== */

    function normalizeQuestions(raw) {

        return raw.map(
            (q, index) => {

                let options =
                    Array.isArray(q.options)
                        ? q.options
                        : [];

                options =
                    options.slice(0, 4);

                while (
                    options.length < 4
                ) {
                    options.push(
                        "Option unavailable"
                    );
                }

                let answer =
                    Number(q.answer);

                if (
                    Number.isNaN(answer) ||
                    answer < 0 ||
                    answer > 3
                ) {
                    answer = 0;
                }

                return {

                    id:
                        q.id ||
                        `ai-${Date.now()}-${index}`,

                    subject:
                        q.subject ||
                        "General",

                    chapter:
                        q.chapter ||
                        "General",

                    question:
                        q.question ||
                        "Question unavailable",

                    options,

                    answer,

                    explanation:
                        q.explanation ||
                        "Detailed explanation will be provided by the AI engine.",

                    concept:
                        q.concept ||
                        "Concept review"

                };

            }
        );

    }


    /* =====================================================
       START TEST
    ===================================================== */

    function startGeneratedTest() {

        P3.answers =
            new Array(
                P3.questions.length
            ).fill(null);

        P3.currentQuestion = 0;

        P3.remainingSeconds =
            EXAMS[P3.exam].duration;

        P3.testStarted = true;

        startTimer();

        renderQuestion();

    }


    /* =====================================================
       TIMER
    ===================================================== */

    function startTimer() {

        stopTimer();

        updateTimer();

        P3.timerInterval =
            setInterval(
                () => {

                    if (
                        P3.remainingSeconds <= 0
                    ) {

                        stopTimer();

                        submitTest(true);

                        return;

                    }

                    P3.remainingSeconds--;

                    updateTimer();

                },
                1000
            );

    }


    function stopTimer() {

        if (P3.timerInterval) {

            clearInterval(
                P3.timerInterval
            );

            P3.timerInterval = null;

        }

    }


    function updateTimer() {

        if (!timer) return;

        const minutes =
            Math.floor(
                P3.remainingSeconds / 60
            );

        const seconds =
            P3.remainingSeconds % 60;

        timer.textContent =
            `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

        timer.classList.toggle(
            "warning",
            P3.remainingSeconds <= 300 &&
            P3.remainingSeconds > 60
        );

        timer.classList.toggle(
            "danger",
            P3.remainingSeconds <= 60
        );

    }


    /* =====================================================
       RENDER QUESTION
    ===================================================== */

    function renderQuestion() {

        const q =
            P3.questions[
                P3.currentQuestion
            ];

        if (!q) return;

        const total =
            P3.questions.length;

        const number =
            P3.currentQuestion + 1;

        const progress =
            (number / total) * 100;

        testArea.innerHTML = `

            <div class="p3-question-wrap">

                <div class="p3-progress-row">

                    <span class="p3-progress-text">
                        Question ${number} / ${total}
                    </span>

                    <div class="p3-progress-track">
                        <div
                            class="p3-progress-fill"
                            style="width:${progress}%"
                        ></div>
                    </div>

                </div>


                <div class="p3-question-card">

                    <span class="p3-subject-badge">
                        ${escapeHTML(q.subject)}
                    </span>

                    <div class="p3-question">
                        ${escapeHTML(q.question)}
                    </div>


                    <div class="p3-options">

                        ${q.options.map(
                            (option, index) => `

                                <button
                                    class="p3-option ${
                                        P3.answers[
                                            P3.currentQuestion
                                        ] === index
                                            ? "selected"
                                            : ""
                                    }"
                                    data-answer="${index}"
                                    type="button"
                                >

                                    <span class="p3-option-letter">
                                        ${String.fromCharCode(
                                            65 + index
                                        )}
                                    </span>

                                    <span>
                                        ${escapeHTML(option)}
                                    </span>

                                </button>

                            `
                        ).join("")}

                    </div>

                </div>


                <div class="p3-test-controls">

                    <button
                        id="previousQuestion"
                        class="p3-control-btn"
                        type="button"
                        ${
                            P3.currentQuestion === 0
                                ? "disabled"
                                : ""
                        }
                    >
                        ← Previous
                    </button>


                    <button
                        id="nextQuestion"
                        class="p3-control-btn primary"
                        type="button"
                    >
                        ${
                            P3.currentQuestion ===
                            total - 1
                                ? "Review"
                                : "Next →"
                        }
                    </button>

                </div>


                ${
                    P3.currentQuestion ===
                    total - 1
                        ? `
                            <button
                                id="submitTest"
                                class="p3-submit-btn"
                                type="button"
                            >
                                SUBMIT TEST
                            </button>
                          `
                        : ""
                }

            </div>

        `;

    }


    /* =====================================================
       ANSWER
    ===================================================== */

    function selectAnswer(index) {

        P3.answers[
            P3.currentQuestion
        ] = index;

        renderQuestion();

    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    function nextQuestion() {

        if (
            P3.currentQuestion <
            P3.questions.length - 1
        ) {

            P3.currentQuestion++;

            renderQuestion();

        }

    }


    function previousQuestion() {

        if (
            P3.currentQuestion > 0
        ) {

            P3.currentQuestion--;

            renderQuestion();

        }

    }


    /* =====================================================
       SUBMIT
    ===================================================== */

    function submitTest(autoSubmit = false) {

        if (!P3.questions.length) return;

        if (!autoSubmit) {

            const unanswered =
                P3.answers.filter(
                    answer => answer === null
                ).length;

            if (unanswered > 0) {

                const proceed =
                    window.confirm(
                        `${unanswered} question(s) are unanswered.\n\nSubmit anyway?`
                    );

                if (!proceed) {
                    return;
                }

            }

        }

        stopTimer();

        P3.testStarted = false;

        const result =
            calculateResult();

        renderResults(result);

    }


    /* =====================================================
       RESULT CALCULATION
    ===================================================== */

    function calculateResult() {

        let correct = 0;

        let wrong = 0;

        let unanswered = 0;

        P3.questions.forEach(
            (q, index) => {

                const selected =
                    P3.answers[index];

                if (selected === null) {

                    unanswered++;

                }
                else if (
                    selected === q.answer
                ) {

                    correct++;

                }
                else {

                    wrong++;

                }

            }
        );


        const total =
            P3.questions.length;

        const accuracy =
            correct + wrong === 0
                ? 0
                : Math.round(
                    correct /
                    (correct + wrong) *
                    100
                );


        return {

            total,

            correct,

            wrong,

            unanswered,

            accuracy

        };

    }


    /* =====================================================
       RESULTS
    ===================================================== */

    function renderResults(result) {

        testArea.innerHTML = `

            <div class="p3-result">

                <div class="p3-score-card">

                    <div class="p3-score-circle">

                        <strong>
                            ${result.correct}/${result.total}
                        </strong>

                    </div>

                    <h2>
                        Test Completed
                    </h2>

                    <p>
                        ${
                            result.accuracy >= 80
                                ? "Excellent performance."
                                : result.accuracy >= 60
                                    ? "Good work. Keep improving."
                                    : "Keep practicing. Your next attempt can be stronger."
                        }
                    </p>


                    <div class="p3-result-stats">

                        <div class="p3-result-stat">
                            <strong>
                                ${result.correct}
                            </strong>
                            <small>Correct</small>
                        </div>

                        <div class="p3-result-stat">
                            <strong>
                                ${result.wrong}
                            </strong>
                            <small>Wrong</small>
                        </div>

                        <div class="p3-result-stat">
                            <strong>
                                ${result.unanswered}
                            </strong>
                            <small>Skipped</small>
                        </div>

                        <div class="p3-result-stat">
                            <strong>
                                ${result.accuracy}%
                            </strong>
                            <small>Accuracy</small>
                        </div>

                    </div>

                </div>


                <div class="p3-ai-analysis">

                    <h3>
                        ✦ AI Performance Analysis
                    </h3>

                    <p>
                        Your detailed AI analysis will
                        identify weak chapters, common
                        mistakes and the concepts you
                        should revise next.
                    </p>

                </div>


                <div class="p3-solutions">

                    <h3>
                        Detailed Solutions
                    </h3>

                    ${renderSolutions()}

                </div>


                <button
                    id="restartAIMock"
                    class="p3-submit-btn"
                    type="button"
                >
                    ✦ TAKE ANOTHER AI MOCK
                </button>

            </div>

        `;

    }


    /* =====================================================
       SOLUTIONS
    ===================================================== */

    function renderSolutions() {

        return P3.questions.map(
            (q, index) => {

                const selected =
                    P3.answers[index];

                const isCorrect =
                    selected === q.answer;

                return `

                    <div class="p3-solution">

                        <h4>
                            Q${index + 1}.
                            ${escapeHTML(q.question)}
                        </h4>

                        <div class="answer">

                            Correct Answer:
                            ${String.fromCharCode(
                                65 + q.answer
                            )}

                            —
                            ${escapeHTML(
                                q.options[q.answer]
                            )}

                        </div>


                        ${
                            selected !== null
                                ? `
                                    <div class="p3-explanation">

                                        Your answer:
                                        <strong>
                                            ${String.fromCharCode(
                                                65 + selected
                                            )}
                                        </strong>

                                        —
                                        ${
                                            isCorrect
                                                ? "Correct"
                                                : "Incorrect"
                                        }

                                    </div>
                                  `
                                : `
                                    <div class="p3-explanation">
                                        Not attempted.
                                    </div>
                                  `
                        }


                        <div class="p3-explanation">

                            <strong>
                                Concept:
                            </strong>

                            ${escapeHTML(q.concept)}

                        </div>


                        <div class="p3-explanation">

                            <strong>
                                Detailed Solution:
                            </strong>

                            ${escapeHTML(
                                q.explanation
                            )}

                        </div>

                    </div>

                `;

            }
        ).join("");

    }


    /* =====================================================
       TOPIC PRACTICE
    ===================================================== */

    function openTopicPractice() {

        syncExam();

        const subjects =
            EXAMS[P3.exam].subjects;

        practiceContent.innerHTML = `

            <div class="p3-panel">

                <div class="p3-panel-title">
                    🎯 AI Topic Practice
                </div>

                <div class="p3-panel-subtitle">
                    Choose a subject. The AI engine will
                    generate fresh topic-based questions.
                </div>


                <div
                    class="p3-choice-grid"
                    style="margin-top:18px"
                >

                    ${subjects.map(
                        subject => `

                            <button
                                class="p3-choice"
                                data-topic-subject="${escapeHTML(subject)}"
                                type="button"
                            >

                                <strong>
                                    ${escapeHTML(subject)}
                                </strong>

                                <small>
                                    Topic practice
                                </small>

                            </button>

                        `
                    ).join("")}

                </div>

            </div>

        `;

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });

    }


    /* =====================================================
       IMPORTANT PRACTICE
    ===================================================== */

    function openImportantPractice() {

        syncExam();

        practiceContent.innerHTML = `

            <div class="p3-panel">

                <div class="p3-panel-title">
                    🔥 Important Practice
                </div>

                <div class="p3-panel-subtitle">

                    AI-generated questions focused on
                    high-priority concepts.

                    <br><br>

                    ${
                        EXAMS[P3.exam]
                            .subjects
                            .join(" • ")
                    }

                </div>


                <button
                    id="generateImportant"
                    class="p3-submit-btn"
                    type="button"
                >
                    ✦ GENERATE IMPORTANT QUESTIONS
                </button>

            </div>

        `;

        const btn =
            $("generateImportant");

        if (btn) {

            btn.onclick =
                () => {

                    P3.mode = "important";

                    P3.subject = "all";

                    P3.difficulty = "mixed";

                    P3.questionCount = 20;

                    generateAIMock();

                };

        }

    }


    /* =====================================================
       PYQ — FUTURE UPDATE ONLY
    ===================================================== */

    function showPYQUpdate() {

        practiceContent.innerHTML = `

            <div class="p3-panel">

                <div class="p3-panel-title">
                    📄 PYQ Engine
                </div>

                <div class="p3-panel-subtitle">

                    Real previous-year questions will
                    be added in a future MASTREY PRO
                    content update.

                    <br><br>

                    The AI Mock Engine does <strong>
                    NOT
                    </strong> use PYQs.

                </div>

            </div>

        `;

    }


    /* =====================================================
       CLOSE TEST
    ===================================================== */

    function closeTestModal() {

        if (
            P3.testStarted
        ) {

            const leave =
                window.confirm(
                    "Your current test will be stopped. Leave the test?"
                );

            if (!leave) {
                return;
            }

        }

        stopTimer();

        P3.testStarted = false;

        testModal.classList.add(
            "hidden"
        );

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       EXPOSE FOR OTHER PHASES
    ===================================================== */

    window.MasteryPractice = {

        refreshExam: syncExam,

        getState: () => ({
            ...P3
        }),

        getSubjects: () => {

            return EXAMS[
                getCurrentExam()
            ].subjects;

        }

    };


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initPhase3
        );

    }
    else {

        initPhase3();

    }

})();