/* =========================================================
   JEE MASTREY PRO
   MAIN SCRIPT
   GLOBAL APP ENGINE
   EXAM-AWARE ARCHITECTURE
========================================================= */

"use strict";

/* =========================================================
   GLOBAL EXAM CONFIGURATION

   IMPORTANT:
   PYQs are intentionally NOT included here.
   PYQ engine will be added later as an update.
========================================================= */

const EXAM_CONFIG = {

    jee: {
        id: "jee",
        name: "JEE",
        fullName: "JEE Main + Advanced",

        subjects: [
            {
                id: "physics",
                name: "Physics",
                icon: "⚛️",
                description: "Concepts • Formulas • Problems"
            },
            {
                id: "chemistry",
                name: "Chemistry",
                icon: "🧪",
                description: "Physical • Organic • Inorganic"
            },
            {
                id: "mathematics",
                name: "Mathematics",
                icon: "∑",
                description: "Concepts • Formulas • Problems"
            }
        ]
    },

    neet: {
        id: "neet",
        name: "NEET",
        fullName: "NEET UG",

        subjects: [
            {
                id: "physics",
                name: "Physics",
                icon: "⚛️",
                description: "Concepts • Formulas • Problems"
            },
            {
                id: "chemistry",
                name: "Chemistry",
                icon: "🧪",
                description: "Physical • Organic • Inorganic"
            },
            {
                id: "biology",
                name: "Biology",
                icon: "🧬",
                description: "Botany • Zoology • Concepts"
            }
        ]
    },

    ca: {
        id: "ca",
        name: "CA",
        fullName: "Chartered Accountancy",

        subjects: [
            {
                id: "accounting",
                name: "Financial Accounting",
                icon: "📊",
                description: "Accounts • Concepts • Problems"
            },
            {
                id: "law",
                name: "Business Laws",
                icon: "⚖️",
                description: "Law • Concepts • Cases"
            },
            {
                id: "quantitative",
                name: "Quantitative Aptitude",
                icon: "∑",
                description: "Maths • Reasoning • Statistics"
            },
            {
                id: "economics",
                name: "Business Economics",
                icon: "📈",
                description: "Economics • Concepts • Applications"
            }
        ]
    }

};


/* =========================================================
   APPLICATION STATE
========================================================= */

const APP_STATE = {

    initialized: false,

    exam: localStorage.getItem("jm_exam") || "jee",

    studentName:
        localStorage.getItem("jm_student_name") || "",

    currentPage: "homePage",

    selectedSubject: null,

    studyType: "syllabus",

    selectedChapter: null,

    testRunning: false

};


/* =========================================================
   DOM HELPER
========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return Array.from(document.querySelectorAll(selector));
}


/* =========================================================
   SAFE STORAGE
========================================================= */

function saveState() {

    localStorage.setItem(
        "jm_exam",
        APP_STATE.exam
    );

    localStorage.setItem(
        "jm_student_name",
        APP_STATE.studentName
    );
}


/* =========================================================
   GET CURRENT EXAM
========================================================= */

function getCurrentExam() {

    return (
        EXAM_CONFIG[APP_STATE.exam] ||
        EXAM_CONFIG.jee
    );
}


/* =========================================================
   GET CURRENT SUBJECTS
========================================================= */

function getCurrentSubjects() {

    return getCurrentExam().subjects;
}


/* =========================================================
   FIND SUBJECT
========================================================= */

function getSubject(subjectId) {

    return getCurrentSubjects().find(
        subject => subject.id === subjectId
    );
}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initApp
);


function initApp() {

    if (APP_STATE.initialized) {
        return;
    }

    APP_STATE.initialized = true;

    setupSplash();

    setupAuthentication();

    setupProfile();

    setupNavigation();

    setupExamSwitcher();

    setupGlobalButtons();

    updateExamUI();

    updateDashboard();

}


/* =========================================================
   SPLASH SCREEN
========================================================= */

function setupSplash() {

    const splash = $("#splashScreen");
    const login = $("#loginScreen");
    const loadingBar = $("#loadingBar");
    const loadingText = $("#loadingText");

    if (!splash) {
        return;
    }

    let progress = 0;

    const messages = [
        "Initializing...",
        "Loading study engine...",
        "Preparing practice engine...",
        "Building your command center...",
        "Almost ready..."
    ];

    const interval = setInterval(() => {

        progress += Math.floor(
            Math.random() * 9
        ) + 5;

        if (progress > 100) {
            progress = 100;
        }

        if (loadingBar) {
            loadingBar.style.width =
                progress + "%";
        }

        if (loadingText) {

            const index = Math.min(
                messages.length - 1,
                Math.floor(
                    progress /
                    (100 / messages.length)
                )
            );

            loadingText.textContent =
                messages[index];
        }

        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                splash.classList.add(
                    "hidden"
                );

                showInitialScreen();

            }, 450);
        }

    }, 180);

}


/* =========================================================
   INITIAL SCREEN
========================================================= */

function showInitialScreen() {

    const app =
        $("#app");

    const login =
        $("#loginScreen");

    const profile =
        $("#profileSetup");

    if (APP_STATE.studentName) {

        if (login) {
            login.classList.add("hidden");
        }

        if (profile) {
            profile.classList.add("hidden");
        }

        if (app) {
            app.classList.remove("hidden");
        }

        updateExamUI();
        updateDashboard();

        return;
    }

    if (login) {
        login.classList.remove("hidden");
    }

}


/* =========================================================
   AUTHENTICATION
========================================================= */

function setupAuthentication() {

    const googleBtn =
        $("#googleBtn");

    const guestBtn =
        $("#guestBtn");

    if (googleBtn) {

        googleBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "Google Sign-In will be connected in the authentication update."
                );

            }
        );

    }

    if (guestBtn) {

        guestBtn.addEventListener(
            "click",
            () => {

                const login =
                    $("#loginScreen");

                const profile =
                    $("#profileSetup");

                if (login) {
                    login.classList.add(
                        "hidden"
                    );
                }

                if (profile) {
                    profile.classList.remove(
                        "hidden"
                    );
                }

            }
        );

    }

}


/* =========================================================
   PROFILE SETUP
========================================================= */

function setupProfile() {

    const nameInput =
        $("#studentName");

    const enterBtn =
        $("#enterBtn");

    const examCards =
        $all(".exam-card");

    let selectedExam =
        APP_STATE.exam || null;


    if (nameInput) {

        nameInput.value =
            APP_STATE.studentName;

        nameInput.addEventListener(
            "input",
            updateEnterButton
        );
    }


    examCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                examCards.forEach(
                    c =>
                        c.classList.remove(
                            "selected"
                        )
                );

                card.classList.add(
                    "selected"
                );

                selectedExam =
                    card.dataset.exam;

                updateEnterButton();

            }
        );

    });


    function updateEnterButton() {

        const validName =
            nameInput &&
            nameInput.value.trim().length >= 1;

        const validExam =
            !!selectedExam;

        if (
            enterBtn &&
            validName &&
            validExam
        ) {

            enterBtn.disabled = false;

            enterBtn.classList.remove(
                "disabled"
            );

        } else if (enterBtn) {

            enterBtn.disabled = true;

            enterBtn.classList.add(
                "disabled"
            );
        }
    }


    if (enterBtn) {

        enterBtn.addEventListener(
            "click",
            () => {

                if (
                    !nameInput ||
                    !nameInput.value.trim() ||
                    !selectedExam
                ) {
                    return;
                }

                APP_STATE.studentName =
                    nameInput.value.trim();

                APP_STATE.exam =
                    selectedExam;

                saveState();

                const profile =
                    $("#profileSetup");

                const app =
                    $("#app");

                if (profile) {
                    profile.classList.add(
                        "hidden"
                    );
                }

                if (app) {
                    app.classList.remove(
                        "hidden"
                    );
                }

                updateExamUI();
                updateDashboard();

                showToast(
                    `Welcome to MASTREY PRO, ${APP_STATE.studentName}!`
                );

            }
        );

    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    $all(".nav-btn").forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                const page =
                    btn.dataset.page;

                if (!page) {
                    return;
                }

                navigateTo(page);

            }
        );

    });

}


function navigateTo(pageId) {

    const pages =
        $all(".page");

    pages.forEach(page => {

        page.classList.remove(
            "active"
        );

    });

    const target =
        document.getElementById(pageId);

    if (!target) {
        return;
    }

    target.classList.add("active");

    $all(".nav-btn").forEach(btn => {

        btn.classList.toggle(
            "active",
            btn.dataset.page === pageId
        );

    });

    APP_STATE.currentPage =
        pageId;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "homePage") {
        updateDashboard();
    }

    if (pageId === "learnPage") {

        if (
            typeof window.refreshPhase2 ===
            "function"
        ) {
            window.refreshPhase2();
        }
    }

    if (pageId === "practicePage") {

        if (
            typeof window.refreshPhase3 ===
            "function"
        ) {
            window.refreshPhase3();
        }
    }

    if (pageId === "profilePage") {
        updateProfilePage();
    }

}


/* =========================================================
   EXAM SWITCHER
========================================================= */

function setupExamSwitcher() {

    const switchBtn =
        $("#examSwitchBtn");

    const modal =
        $("#examModal");

    const closeBtn =
        $("#closeModal");


    if (switchBtn) {

        switchBtn.addEventListener(
            "click",
            () => {

                if (!modal) {
                    return;
                }

                modal.classList.remove(
                    "hidden"
                );

            }
        );

    }


    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeExamModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {
                    closeExamModal();
                }

            }
        );

    }


    $all(".switch-card").forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const exam =
                    card.dataset.switch;

                switchExam(exam);

            }
        );

    });

}


function closeExamModal() {

    const modal =
        $("#examModal");

    if (modal) {
        modal.classList.add(
            "hidden"
        );
    }

}


/* =========================================================
   SWITCH EXAM
========================================================= */

function switchExam(examId) {

    if (!EXAM_CONFIG[examId]) {
        return;
    }

    if (
        APP_STATE.exam === examId
    ) {

        closeExamModal();

        showToast(
            `${EXAM_CONFIG[examId].name} is already selected.`
        );

        return;
    }


    APP_STATE.exam =
        examId;

    APP_STATE.selectedSubject =
        null;

    APP_STATE.selectedChapter =
        null;

    saveState();

    updateExamUI();

    updateDashboard();


    /*
       Phase 2 and Phase 3 are notified
       through their public refresh functions.
    */

    if (
        typeof window.onExamChanged ===
        "function"
    ) {

        try {
            window.onExamChanged(
                examId,
                getCurrentExam()
            );
        } catch (error) {

            console.error(
                "Exam change handler error:",
                error
            );

        }
    }


    if (
        typeof window.refreshPhase2 ===
        "function"
    ) {

        try {
            window.refreshPhase2();
        } catch (error) {
            console.error(error);
        }

    }


    if (
        typeof window.refreshPhase3 ===
        "function"
    ) {

        try {
            window.refreshPhase3();
        } catch (error) {
            console.error(error);
        }

    }


    closeExamModal();


    showToast(
        `Switched to ${getCurrentExam().name}`
    );

}


/* =========================================================
   UPDATE GLOBAL EXAM UI
========================================================= */

function updateExamUI() {

    const exam =
        getCurrentExam();


    const currentExam =
        $("#currentExam");

    if (currentExam) {

        currentExam.textContent =
            exam.name;
    }


    const testExam =
        $("#testExam");

    if (testExam) {

        testExam.textContent =
            exam.name;
    }


    document.documentElement
        .dataset.exam =
        exam.id;


    /*
       Update exam selector cards
    */

    $all(".switch-card").forEach(
        card => {

            card.classList.toggle(
                "selected",
                card.dataset.switch ===
                exam.id
            );

        }
    );


    /*
       Update page-level exam labels
       if elements exist.
    */

    $all("[data-current-exam]")
        .forEach(element => {

            element.textContent =
                exam.name;

        });


    /*
       CRITICAL:
       Subject rendering is delegated to
       Phase 2/3 so Biology replaces Maths
       for NEET.
    */

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const dashboard =
        $("#dashboard");

    if (!dashboard) {
        return;
    }

    const exam =
        getCurrentExam();

    const subjects =
        exam.subjects;


    const firstName =
        APP_STATE.studentName
            ? APP_STATE.studentName
                .split(" ")[0]
            : "Aspirant";


    dashboard.innerHTML = `

        <div class="dashboard-hero">

            <span>
                ${escapeHTML(exam.fullName)}
            </span>

            <h1>
                Welcome back,
                <span>
                    ${escapeHTML(firstName)}.
                </span>
            </h1>

            <p>
                Your ${escapeHTML(exam.name)}
                preparation command center is ready.
                Learn concepts, practice intelligently
                and track your progress.
            </p>

        </div>


        <div
            class="dashboard-subjects"
            style="
                display:grid;
                grid-template-columns:
                    repeat(
                        auto-fit,
                        minmax(150px,1fr)
                    );
                gap:12px;
            "
        >

            ${subjects.map(
                subject => `

                    <button
                        type="button"
                        class="study-card"
                        data-dashboard-subject="${escapeHTML(subject.id)}"
                    >

                        <div class="study-icon">
                            ${subject.icon}
                        </div>

                        <strong>
                            ${escapeHTML(subject.name)}
                        </strong>

                        <small>
                            ${escapeHTML(subject.description)}
                        </small>

                        <span class="card-arrow">
                            →
                        </span>

                    </button>

                `
            ).join("")}

        </div>


        <div
            class="important-card"
            style="
                margin-top:16px;
                padding:20px;
                border-radius:21px;
                border:1px solid rgba(255,255,255,.08);
                background:rgba(255,255,255,.035);
                display:flex;
                align-items:center;
                gap:14px;
            "
        >

            <div
                style="
                    font-size:28px;
                "
            >
                🚀
            </div>

            <div>

                <strong>
                    Keep building your preparation.
                </strong>

                <p
                    style="
                        margin-top:5px;
                        color:#9da6c5;
                        font-size:11px;
                    "
                >
                    Your study engine is ready for
                    ${escapeHTML(exam.name)}.
                </p>

            </div>

        </div>

    `;


    /*
       Dashboard subject buttons
    */

    $all(
        "[data-dashboard-subject]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const subject =
                    button.dataset
                        .dashboardSubject;

                APP_STATE.selectedSubject =
                    subject;

                navigateTo("learnPage");

                if (
                    typeof window.openSubjectFromMain
                    === "function"
                ) {

                    window.openSubjectFromMain(
                        subject
                    );

                }

            }
        );

    });

}


/* =========================================================
   GLOBAL BUTTONS
========================================================= */

function setupGlobalButtons() {

    const profile =
        $("#profileContent");

    /*
       Profile is generated dynamically,
       so static listeners are unnecessary.
    */

}


/* =========================================================
   PROFILE PAGE
========================================================= */

function updateProfilePage() {

    const container =
        $("#profileContent");

    if (!container) {
        return;
    }

    const exam =
        getCurrentExam();


    container.innerHTML = `

        <div
            class="glass-card"
            style="
                max-width:600px;
                margin:20px auto;
            "
        >

            <div class="small-logo">
                JM
            </div>

            <div class="eyebrow">
                STUDENT PROFILE
            </div>

            <h2>
                ${escapeHTML(
                    APP_STATE.studentName ||
                    "Aspirant"
                )}
            </h2>

            <p
                class="description"
            >
                Currently preparing for
                <strong>
                    ${escapeHTML(exam.fullName)}
                </strong>.
            </p>


            <div
                style="
                    margin-top:22px;
                    padding:17px;
                    border-radius:17px;
                    background:rgba(255,255,255,.04);
                    border:1px solid rgba(255,255,255,.07);
                "
            >

                <small
                    style="
                        color:#8f99ba;
                    "
                >
                    CURRENT SUBJECTS
                </small>

                <div
                    style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:8px;
                        margin-top:12px;
                    "
                >

                    ${exam.subjects.map(
                        subject => `

                            <span
                                style="
                                    padding:
                                        8px 11px;
                                    border-radius:10px;
                                    background:
                                        rgba(
                                            124,
                                            92,
                                            255,
                                            .1
                                        );
                                    font-size:10px;
                                "
                            >
                                ${subject.icon}
                                ${escapeHTML(
                                    subject.name
                                )}
                            </span>

                        `
                    ).join("")}

                </div>

            </div>


            <button
                id="resetAppBtn"
                class="secondary-btn"
                type="button"
            >
                Reset Profile
            </button>

        </div>

    `;


    const resetBtn =
        $("#resetAppBtn");

    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            resetApplication
        );

    }

}


/* =========================================================
   RESET APPLICATION
========================================================= */

function resetApplication() {

    const confirmed =
        window.confirm(
            "Reset your MASTREY PRO profile?"
        );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        "jm_exam"
    );

    localStorage.removeItem(
        "jm_student_name"
    );

    APP_STATE.exam =
        "jee";

    APP_STATE.studentName =
        "";

    APP_STATE.selectedSubject =
        null;

    APP_STATE.selectedChapter =
        null;

    const app =
        $("#app");

    const profile =
        $("#profileSetup");

    const login =
        $("#loginScreen");

    if (app) {
        app.classList.add("hidden");
    }

    if (profile) {
        profile.classList.add("hidden");
    }

    if (login) {
        login.classList.remove("hidden");
    }

    showToast(
        "Profile reset successfully."
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        $("#toast");

    if (!toast) {
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

        }, 2600);

}


/* =========================================================
   HTML ESCAPE
========================================================= */

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


/* =========================================================
   PUBLIC GLOBAL API
   Other phases use these functions.
========================================================= */

window.JM = {

    state: APP_STATE,

    exams: EXAM_CONFIG,

    getCurrentExam,

    getCurrentSubjects,

    getSubject,

    switchExam,

    navigateTo,

    showToast,

    escapeHTML

};


/* =========================================================
   DEBUG HELPER
========================================================= */

window.getJMState = function() {

    return {

        exam: APP_STATE.exam,

        examConfig:
            getCurrentExam(),

        subjects:
            getCurrentSubjects(),

        studentName:
            APP_STATE.studentName

    };

};


/* =========================================================
   END MAIN SCRIPT
========================================================= */