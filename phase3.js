/* =========================================================
   JEE MASTREY PRO
   PHASE 3 — AI PRACTICE ENGINE
   VERSION 4 — JEE + NEET + CA
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       CONFIG
    ===================================================== */

    const API_URL =
        "https://jee-mastrey-pro-vqyt.vercel.app/api/generate-test";

    const EXAMS = {

        jee: {
            name: "JEE",
            subjects: [
                "Physics",
                "Chemistry",
                "Mathematics"
            ]
        },

        neet: {
            name: "NEET",
            subjects: [
                "Physics",
                "Chemistry",
                "Biology"
            ]
        },

        ca: {
            name: "CA",
            subjects: [
                "Accounting",
                "Business Studies",
                "Economics",
                "Law"
            ]
        }

    };


    /* =====================================================
       STATE
    ===================================================== */

    let currentExam = "jee";

    let currentMode = "mock";

    let currentSubject = "all";

    let currentDifficulty = "mixed";

    let currentQuestionCount = 20;

    let currentDuration = 60;

    let questions = [];

    let currentQuestion = 0;

    let answers = {};

    let marked = {};

    let timerInterval = null;

    let remainingSeconds = 0;

    let testStarted = false;

    let testFinished = false;


    /* =====================================================
       DOM
    ===================================================== */

    const $ = id =>
        document.getElementById(id);


    const testModal =
        $("testModal");

    const closeTest =
        $("closeTest");

    const testArea =
        $("testArea");

    const timer =
        $("timer");

    const testExam =
        $("testExam");


    const practiceContent =
        $("practiceContent");


    const startMockBtn =
        $("startMockBtn");

    const topicPracticeBtn =
        $("topicPracticeBtn");

    const pyqBtn =
        $("pyqBtn");

    const importantPracticeBtn =
        $("importantPracticeBtn");


    /* =====================================================
       UTILITIES
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function showToast(message) {

        const toast =
            $("toast");

        if (!toast) {
            alert(message);
            return;
        }

        toast.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(
            showToast.timeout
        );

        showToast.timeout =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3000);

    }


    function formatTime(seconds) {

        const mins =
            Math.floor(
                seconds / 60
            );

        const secs =
            seconds % 60;

        return (
            String(mins).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0")
        );

    }


    function getSelectedExam() {

        /*
         * First try the global app state if
         * script.js created one.
         */

        const stored =
            localStorage.getItem(
                "mastrey_exam"
            );

        if (
            stored &&
            EXAMS[stored]
        ) {
            currentExam =
                stored;
        }

        return currentExam;

    }


    function setExam(exam) {

        if (!EXAMS[exam]) {
            exam = "jee";
        }

        currentExam =
            exam;

        localStorage.setItem(
            "mastrey_exam",
            exam
        );

        const currentExamElement =
            $("currentExam");

        if (currentExamElement) {
            currentExamElement.textContent =
                EXAMS[exam].name;
        }

        updateSubjectOptions();

    }


    /* =====================================================
       SUBJECT OPTIONS
    ===================================================== */

    function updateSubjectOptions() {

        const subjects =
            EXAMS[currentExam].subjects;

        /*
         * The configuration UI is created
         * dynamically, so no HTML changes
         * are required.
         */

        const subjectSelect =
            document.querySelector(
                "#aiSubjectSelect"
            );

        if (!subjectSelect) {
            return;
        }

        subjectSelect.innerHTML =
            `<option value="all">All Subjects</option>` +
            subjects.map(
                subject =>
                    `<option value="${escapeHTML(subject)}">${escapeHTML(subject)}</option>`
            ).join("");

    }


    /* =====================================================
       BUILD MOCK CONFIGURATION
    ===================================================== */

    function openMockConfiguration(
        mode = "mock"
    ) {

        currentMode =
            mode;

        const exam =
            EXAMS[currentExam];

        if (!practiceContent) {
            return;
        }

        practiceContent.innerHTML = `

            <div class="p3-config">

                <div class="p3-config-header">

                    <span class="p3-label">
                        MASTREY AI
                    </span>

                    <h3>
                        Generate Fresh Mock Test
                    </h3>

                    <p>
                        Original AI-generated questions.
                        No PYQs and no repeated questions.
                    </p>

                </div>


                <div class="p3-config-grid">


                    <div class="p3-field">

                        <label>
                            Examination
                        </label>

                        <select id="aiExamSelect">

                            <option value="jee"
                                ${currentExam === "jee" ? "selected" : ""}>
                                JEE
                            </option>

                            <option value="neet"
                                ${currentExam === "neet" ? "selected" : ""}>
                                NEET
                            </option>

                            <option value="ca"
                                ${currentExam === "ca" ? "selected" : ""}>
                                CA
                            </option>

                        </select>

                    </div>


                    <div class="p3-field">

                        <label>
                            Subject
                        </label>

                        <select id="aiSubjectSelect">

                            <option value="all">
                                All Subjects
                            </option>

                            ${exam.subjects.map(
                                subject =>
                                    `<option value="${escapeHTML(subject)}">
                                        ${escapeHTML(subject)}
                                    </option>`
                            ).join("")}

                        </select>

                    </div>


                    <div class="p3-field">

                        <label>
                            Difficulty
                        </label>

                        <select id="aiDifficultySelect">

                            <option value="easy">
                                Easy
                            </option>

                            <option value="medium"
                                selected>
                                Medium
                            </option>

                            <option value="hard">
                                Hard
                            </option>

                            <option value="mixed">
                                Mixed
                            </option>

                        </select>

                    </div>


                    <div class="p3-field">

                        <label>
                            Questions
                        </label>

                        <select id="aiQuestionCount">

                            <option value="10">
                                10 Questions
                            </option>

                            <option value="20"
                                selected>
                                20 Questions
                            </option>

                            <option value="30">
                                30 Questions
                            </option>

                            <option value="40">
                                40 Questions
                            </option>

                            <option value="50">
                                50 Questions
                            </option>

                        </select>

                    </div>


                    <div class="p3-field">

                        <label>
                            Duration
                        </label>

                        <select id="aiDuration">

                            <option value="15">
                                15 Minutes
                            </option>

                            <option value="30">
                                30 Minutes
                            </option>

                            <option value="60"
                                selected>
                                60 Minutes
                            </option>

                            <option value="90">
                                90 Minutes
                            </option>

                            <option value="180">
                                180 Minutes
                            </option>

                        </select>

                    </div>

                </div>


                <div
                    id="aiExamInfo"
                    class="p3-exam-info"
                >

                    <strong>
                        ${escapeHTML(exam.name)}
                    </strong>

                    <span>
                        ${exam.subjects.map(
                            escapeHTML
                        ).join(" • ")}
                    </span>

                </div>


                <button
                    id="generateAITest"
                    class="primary-btn p3-generate-btn"
                    type="button"
                >

                    ✦ GENERATE FRESH AI TEST

                </button>


                <div
                    id="aiGenerationStatus"
                    class="p3-generation-status"
                ></div>

            </div>
        `;


        const examSelect =
            $("aiExamSelect");

        examSelect.addEventListener(
            "change",
            () => {

                setExam(
                    examSelect.value
                );

                openMockConfiguration(
                    currentMode
                );

            }
        );


        $("generateAITest")
            .addEventListener(
                "click",
                generateAITest
            );

    }


    /* =====================================================
       GENERATE AI TEST
    ===================================================== */

    async function generateAITest() {

        const button =
            $("generateAITest");

        const status =
            $("aiGenerationStatus");


        currentExam =
            $("aiExamSelect").value;

        currentSubject =
            $("aiSubjectSelect").value;

        currentDifficulty =
            $("aiDifficultySelect").value;

        currentQuestionCount =
            Number(
                $("aiQuestionCount").value
            );

        currentDuration =
            Number(
                $("aiDuration").value
            );


        setExam(
            currentExam
        );


        button.disabled =
            true;

        button.innerHTML =
            "✦ MASTREY AI IS CREATING...";


        status.innerHTML = `
            <div class="ai-loading">
                <span class="ai-loader"></span>

                <div>
                    <strong>
                        Generating fresh questions...
                    </strong>

                    <small>
                        No PYQs • No duplicates •
                        Exam-specific syllabus
                    </small>
                </div>
            </div>
        `;


        try {

            const payload = {

                exam:
                    currentExam,

                mode:
                    currentMode,

                subject:
                    currentSubject,

                difficulty:
                    currentDifficulty,

                questionCount:
                    currentQuestionCount

            };


            const response =
                await fetch(
                    API_URL,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );


            if (!response.ok) {

                let serverMessage =
                    "AI server error.";

                try {

                    const errorData =
                        await response.json();

                    if (
                        errorData &&
                        errorData.error
                    ) {
                        serverMessage =
                            errorData.error;
                    }

                }
                catch (_) {}

                throw new Error(
                    serverMessage
                );

            }


            const data =
                await response.json();


            if (
                !data ||
                data.success !== true
            ) {

                throw new Error(
                    data?.error ||
                    "AI could not generate the test."
                );

            }


            if (
                !Array.isArray(
                    data.questions
                ) ||
                data.questions.length === 0
            ) {

                throw new Error(
                    "No questions were returned."
                );

            }


            /*
             * Extra frontend validation.
             */

            const allowed =
                EXAMS[currentExam]
                    .subjects;


            questions =
                data.questions.filter(
                    question => {

                        if (
                            !allowed.includes(
                                question.subject
                            )
                        ) {
                            return false;
                        }

                        if (
                            currentSubject !== "all" &&
                            question.subject !==
                                currentSubject
                        ) {
                            return false;
                        }

                        return (
                            Array.isArray(
                                question.options
                            ) &&
                            question.options.length ===
                                4
                        );

                    }
                );


            if (
                questions.length === 0
            ) {

                throw new Error(
                    "Returned questions did not match the selected exam."
                );

            }


            /*
             * Start test.
             */

            currentQuestion =
                0;

            answers = {};

            marked = {};

            testStarted =
                true;

            testFinished =
                false;

            remainingSeconds =
                currentDuration * 60;


            openTestModal();

            renderQuestion();

            startTimer();


        }
        catch (error) {

            console.error(
                "AI MOCK ERROR:",
                error
            );


            status.innerHTML = `

                <div class="p3-error">

                    <strong>
                        ⚠️ Unable to generate test
                    </strong>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>

                    <small>
                        Check that your AI backend
                        is deployed and configured.
                    </small>

                </div>
            `;


        }
        finally {

            button.disabled =
                false;

            button.innerHTML =
                "✦ GENERATE FRESH AI TEST";

        }

    }


    /* =====================================================
       TEST MODAL
    ===================================================== */

    function openTestModal() {

        if (!testModal) {
            return;
        }

        testModal.classList.remove(
            "hidden"
        );

        testModal.classList.add(
            "active"
        );

        if (testExam) {
            testExam.textContent =
                EXAMS[currentExam].name;
        }

        document.body.classList.add(
            "test-open"
        );

    }


    function closeTestModal() {

        stopTimer();

        testStarted =
            false;

        if (testModal) {

            testModal.classList.add(
                "hidden"
            );

            testModal.classList.remove(
                "active"
            );

        }

        document.body.classList.remove(
            "test-open"
        );

    }


    /* =====================================================
       RENDER QUESTION
    ===================================================== */

    function renderQuestion() {

        if (
            !testArea ||
            !questions.length
        ) {
            return;
        }


        const q =
            questions[currentQuestion];


        const selectedAnswer =
            answers[currentQuestion];


        const markedQuestion =
            marked[currentQuestion] === true;


        testArea.innerHTML = `

            <div class="p3-test-container">


                <div class="p3-progress-header">

                    <div>

                        <span>
                            QUESTION
                        </span>

                        <strong>
                            ${currentQuestion + 1}
                            /
                            ${questions.length}
                        </strong>

                    </div>


                    <button
                        id="markQuestion"
                        class="p3-mark-btn ${markedQuestion ? "marked" : ""}"
                        type="button"
                    >

                        ${markedQuestion ? "★ Marked" : "☆ Mark"}

                    </button>

                </div>


                <div class="p3-progress-bar">

                    <span
                        style="width:${(
                            ((currentQuestion + 1) /
                            questions.length) *
                            100
                        ).toFixed(1)}%"
                    ></span>

                </div>


                <div class="p3-question-meta">

                    <span>
                        ${escapeHTML(q.subject)}
                    </span>

                    <span>
                        ${escapeHTML(q.chapter)}
                    </span>

                </div>


                <div class="p3-question-card">

                    <h2>
                        ${escapeHTML(q.question)}
                    </h2>

                </div>


                <div class="p3-options">

                    ${q.options.map(
                        (option, index) => {

                            const isSelected =
                                selectedAnswer ===
                                index;

                            return `

                                <button
                                    class="p3-option ${
                                        isSelected
                                            ? "selected"
                                            : ""
                                    }"
                                    data-option="${index}"
                                    type="button"
                                >

                                    <span class="option-letter">
                                        ${String.fromCharCode(
                                            65 + index
                                        )}
                                    </span>

                                    <span class="option-text">
                                        ${escapeHTML(option)}
                                    </span>

                                </button>

                            `;

                        }
                    ).join("")}

                </div>


                <div class="p3-navigation">

                    <button
                        id="prevQuestion"
                        class="secondary-btn"
                        type="button"
                        ${currentQuestion === 0 ? "disabled" : ""}
                    >
                        ← Previous
                    </button>


                    ${
                        currentQuestion <
                        questions.length - 1

                        ?

                        `
                        <button
                            id="nextQuestion"
                            class="primary-btn"
                            type="button"
                        >
                            Next →
                        </button>
                        `

                        :

                        `
                        <button
                            id="submitTest"
                            class="primary-btn p3-submit-btn"
                            type="button"
                        >
                            Submit Test ✓
                        </button>
                        `
                    }

                </div>


                <div class="p3-question-map">

                    <div class="question-map-title">
                        QUESTION MAP
                    </div>

                    <div class="question-map-grid">

                        ${questions.map(
                            (_, index) => `

                                <button
                                    class="
                                        question-map-btn
                                        ${
                                            answers[index] !==
                                            undefined
                                                ? "answered"
                                                : ""
                                        }
                                        ${
                                            marked[index]
                                                ? "marked"
                                                : ""
                                        }
                                        ${
                                            index ===
                                            currentQuestion
                                                ? "current"
                                                : ""
                                        }
                                    "
                                    data-question-index="${index}"
                                    type="button"
                                >
                                    ${index + 1}
                                </button>

                            `
                        ).join("")}

                    </div>

                </div>

            </div>
        `;


        bindQuestionEvents();

    }


    /* =====================================================
       QUESTION EVENTS
    ===================================================== */

    function bindQuestionEvents() {

        document
            .querySelectorAll(
                ".p3-option"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const index =
                                Number(
                                    button.dataset.option
                                );

                            answers[
                                currentQuestion
                            ] = index;

                            renderQuestion();

                        }
                    );

                }
            );


        const markButton =
            $("markQuestion");

        if (markButton) {

            markButton.addEventListener(
                "click",
                () => {

                    marked[
                        currentQuestion
                    ] =
                        !marked[
                            currentQuestion
                        ];

                    renderQuestion();

                }
            );

        }


        const prev =
            $("prevQuestion");

        if (prev) {

            prev.addEventListener(
                "click",
                () => {

                    if (
                        currentQuestion > 0
                    ) {

                        currentQuestion--;

                        renderQuestion();

                    }

                }
            );

        }


        const next =
            $("nextQuestion");

        if (next) {

            next.addEventListener(
                "click",
                () => {

                    if (
                        currentQuestion <
                        questions.length - 1
                    ) {

                        currentQuestion++;

                        renderQuestion();

                    }

                }
            );

        }


        const submit =
            $("submitTest");

        if (submit) {

            submit.addEventListener(
                "click",
                confirmSubmit
            );

        }


        document
            .querySelectorAll(
                ".question-map-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            currentQuestion =
                                Number(
                                    button.dataset
                                        .questionIndex
                                );

                            renderQuestion();

                        }
                    );

                }
            );

    }


    /* =====================================================
       SUBMIT CONFIRMATION
    ===================================================== */

    function confirmSubmit() {

        const answered =
            Object.keys(
                answers
            ).length;


        const unanswered =
            questions.length -
            answered;


        const message =
            unanswered > 0

                ? `You have ${unanswered} unanswered question(s). Submit anyway?`

                : "Submit your test now?";


        if (
            window.confirm(
                message
            )
        ) {

            finishTest();

        }

    }


    /* =====================================================
       FINISH TEST
    ===================================================== */

    function finishTest() {

        if (
            testFinished
        ) {
            return;
        }


        testFinished =
            true;

        testStarted =
            false;

        stopTimer();

        renderResults();

    }


    /* =====================================================
       CALCULATE RESULTS
    ===================================================== */

    function calculateResults() {

        let correct =
            0;

        let wrong =
            0;

        let skipped =
            0;


        questions.forEach(
            (question, index) => {

                if (
                    answers[index] ===
                    undefined
                ) {

                    skipped++;

                }
                else if (
                    answers[index] ===
                    question.answer
                ) {

                    correct++;

                }
                else {

                    wrong++;

                }

            }
        );


        const total =
            questions.length;


        const percentage =
            total
                ? (
                    (correct / total) *
                    100
                ).toFixed(1)
                : "0.0";


        return {

            correct,
            wrong,
            skipped,
            total,
            percentage

        };

    }


    /* =====================================================
       RESULTS
    ===================================================== */

    function renderResults() {

        const result =
            calculateResults();


        const score =
            result.correct;


        const attempted =
            result.correct +
            result.wrong;


        testArea.innerHTML = `

            <div class="p3-results">

                <div class="p3-result-hero">

                    <div class="p3-result-icon">
                        ✦
                    </div>

                    <span>
                        ${escapeHTML(
                            EXAMS[currentExam].name
                        )}
                        • AI MOCK TEST
                    </span>

                    <h2>
                        Test Completed
                    </h2>

                    <p>
                        Your performance summary
                    </p>

                </div>


                <div class="p3-score-circle">

                    <strong>
                        ${score}
                    </strong>

                    <span>
                        / ${result.total}
                    </span>

                </div>


                <div class="p3-result-percent">

                    ${result.percentage}%

                </div>


                <div class="p3-result-stats">

                    <div>
                        <strong>
                            ${result.correct}
                        </strong>
                        <span>
                            Correct
                        </span>
                    </div>

                    <div>
                        <strong>
                            ${result.wrong}
                        </strong>
                        <span>
                            Wrong
                        </span>
                    </div>

                    <div>
                        <strong>
                            ${result.skipped}
                        </strong>
                        <span>
                            Skipped
                        </span>
                    </div>

                    <div>
                        <strong>
                            ${attempted}
                        </strong>
                        <span>
                            Attempted
                        </span>
                    </div>

                </div>


                <div class="p3-result-actions">

                    <button
                        id="viewSolutions"
                        class="primary-btn"
                        type="button"
                    >
                        📖 Detailed Solutions
                    </button>

                    <button
                        id="closeResult"
                        class="secondary-btn"
                        type="button"
                    >
                        Back to Practice
                    </button>

                </div>

            </div>

        `;


        const viewSolutions =
            $("viewSolutions");

        if (viewSolutions) {

            viewSolutions.addEventListener(
                "click",
                renderSolutions
            );

        }


        const closeResult =
            $("closeResult");

        if (closeResult) {

            closeResult.addEventListener(
                "click",
                closeTestModal
            );

        }

    }


    /* =====================================================
       DETAILED SOLUTIONS
    ===================================================== */

    function renderSolutions() {

        testArea.innerHTML = `

            <div class="p3-solutions">

                <div class="p3-solutions-header">

                    <span>
                        MASTREY AI
                    </span>

                    <h2>
                        Detailed Solutions
                    </h2>

                    <p>
                        Understand every question,
                        answer and concept.
                    </p>

                </div>


                ${questions.map(
                    (question, index) => {

                        const userAnswer =
                            answers[index];

                        const isCorrect =
                            userAnswer ===
                            question.answer;

                        const skipped =
                            userAnswer ===
                            undefined;


                        return `

                            <article
                                class="p3-solution-card"
                            >

                                <div class="solution-top">

                                    <span>
                                        Q${index + 1}
                                    </span>

                                    <span>
                                        ${escapeHTML(
                                            question.subject
                                        )}
                                    </span>

                                    <span>
                                        ${escapeHTML(
                                            question.chapter
                                        )}
                                    </span>

                                    <strong class="${
                                        skipped
                                            ? "skipped"
                                            : isCorrect
                                                ? "correct"
                                                : "wrong"
                                    }">

                                        ${
                                            skipped
                                                ? "SKIPPED"
                                                : isCorrect
                                                    ? "CORRECT"
                                                    : "WRONG"
                                        }

                                    </strong>

                                </div>


                                <h3>
                                    ${escapeHTML(
                                        question.question
                                    )}
                                </h3>


                                <div class="solution-options">

                                    ${question.options.map(
                                        (option, optionIndex) => {

                                            const correct =
                                                optionIndex ===
                                                question.answer;

                                            const user =
                                                optionIndex ===
                                                userAnswer;

                                            let className =
                                                "";

                                            if (correct) {
                                                className =
                                                    "solution-correct";
                                            }
                                            else if (user) {
                                                className =
                                                    "solution-wrong";
                                            }

                                            return `

                                                <div
                                                    class="
                                                        solution-option
                                                        ${className}
                                                    "
                                                >

                                                    <b>
                                                        ${String.fromCharCode(
                                                            65 +
                                                            optionIndex
                                                        )}
                                                    </b>

                                                    <span>
                                                        ${escapeHTML(
                                                            option
                                                        )}
                                                    </span>

                                                    ${
                                                        correct
                                                            ? `<i>✓ Correct</i>`
                                                            : ""
                                                    }

                                                    ${
                                                        user &&
                                                        !correct
                                                            ? `<i>✕ Your answer</i>`
                                                            : ""
                                                    }

                                                </div>

                                            `;

                                        }
                                    ).join("")}

                                </div>


                                <div class="p3-concept-box">

                                    <strong>
                                        🧠 Concept
                                    </strong>

                                    <p>
                                        ${escapeHTML(
                                            question.concept
                                        )}
                                    </p>

                                </div>


                                <div class="p3-explanation-box">

                                    <strong>
                                        📖 Detailed Solution
                                    </strong>

                                    <p>
                                        ${escapeHTML(
                                            question.explanation
                                        )}
                                    </p>

                                </div>

                            </article>

                        `;

                    }
                ).join("")}


                <button
                    id="solutionsDone"
                    class="primary-btn"
                    type="button"
                >
                    Finish Review
                </button>

            </div>

        `;


        const done =
            $("solutionsDone");

        if (done) {

            done.addEventListener(
                "click",
                closeTestModal
            );

        }

    }


    /* =====================================================
       TIMER
    ===================================================== */

    function startTimer() {

        stopTimer();


        updateTimerDisplay();


        timerInterval =
            setInterval(
                () => {

                    remainingSeconds--;


                    updateTimerDisplay();


                    if (
                        remainingSeconds <=
                        0
                    ) {

                        stopTimer();

                        if (
                            !testFinished
                        ) {

                            alert(
                                "Time is up. Your test will be submitted."
                            );

                            finishTest();

                        }

                    }

                },
                1000
            );

    }


    function stopTimer() {

        if (
            timerInterval
        ) {

            clearInterval(
                timerInterval
            );

            timerInterval =
                null;

        }

    }


    function updateTimerDisplay() {

        if (!timer) {
            return;
        }

        timer.textContent =
            formatTime(
                Math.max(
                    0,
                    remainingSeconds
                )
            );


        timer.classList.toggle(
            "danger",
            remainingSeconds <=
            300
        );

    }


    /* =====================================================
       PRACTICE BUTTONS
    ===================================================== */

    if (
        startMockBtn
    ) {

        startMockBtn.addEventListener(
            "click",
            () => {

                openMockConfiguration(
                    "mock"
                );

            }
        );

    }


    if (
        topicPracticeBtn
    ) {

        topicPracticeBtn.addEventListener(
            "click",
            () => {

                openMockConfiguration(
                    "topic"
                );

            }
        );

    }


    if (
        importantPracticeBtn
    ) {

        importantPracticeBtn.addEventListener(
            "click",
            () => {

                openMockConfiguration(
                    "important"
                );

            }
        );

    }


    /* =====================================================
       PYQ
       PYQ ENGINE IS INTENTIONALLY DISABLED
       FOR NOW.
    ===================================================== */

    if (
        pyqBtn
    ) {

        pyqBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "PYQ Engine will be added in a future update."
                );

            }
        );

    }


    /* =====================================================
       CLOSE TEST
    ===================================================== */

    if (
        closeTest
    ) {

        closeTest.addEventListener(
            "click",
            () => {

                if (
                    testStarted &&
                    !testFinished
                ) {

                    const leave =
                        window.confirm(
                            "Exit the test? Your current progress will be lost."
                        );

                    if (!leave) {
                        return;
                    }

                }

                closeTestModal();

            }
        );

    }


    /* =====================================================
       EXAM SWITCHER IN MAIN APP
    ===================================================== */

    document
        .querySelectorAll(
            ".switch-card"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const exam =
                            button.dataset.switch;

                        setExam(
                            exam
                        );

                        const modal =
                            $("examModal");

                        if (modal) {

                            modal.classList.add(
                                "hidden"
                            );

                        }

                        showToast(
                            `${EXAMS[exam].name} selected`
                        );

                    }
                );

            }
        );


    const examSwitchBtn =
        $("examSwitchBtn");

    if (
        examSwitchBtn
    ) {

        examSwitchBtn.addEventListener(
            "click",
            () => {

                const modal =
                    $("examModal");

                if (modal) {

                    modal.classList.remove(
                        "hidden"
                    );

                }

            }
        );

    }


    const closeModal =
        $("closeModal");

    if (
        closeModal
    ) {

        closeModal.addEventListener(
            "click",
            () => {

                const modal =
                    $("examModal");

                if (modal) {

                    modal.classList.add(
                        "hidden"
                    );

                }

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initializePhase3() {

        getSelectedExam();

        setExam(
            currentExam
        );

    }


    /*
     * Wait until DOM is ready.
     */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePhase3
        );

    }
    else {

        initializePhase3();

    }


    /* =====================================================
       PUBLIC DEBUG ACCESS
       Useful while developing.
    ===================================================== */

    window.MASTREY_AI = {

        generateTest:
            generateAITest,

        openMock:
            openMockConfiguration,

        getExam:
            () => currentExam,

        getQuestions:
            () => questions,

        getResults:
            calculateResults

    };

})();
