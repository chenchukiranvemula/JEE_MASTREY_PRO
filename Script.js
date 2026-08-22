/* =========================================================
   JEE MASTREY PRO
   FIREBASE + GOOGLE AUTH + APP ENGINE
========================================================= */

"use strict";


/* =========================================================
   FIREBASE
========================================================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged,
    signOut
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyD_5w3LysiBj08MahlcdJrVBv07NnCioN4",

    authDomain:
        "jeemastreypro-a09a2.firebaseapp.com",

    databaseURL:
        "https://jeemastreypro-a09a2-default-rtdb.firebaseio.com",

    projectId:
        "jeemastreypro-a09a2",

    storageBucket:
        "jeemastreypro-a09a2.firebasestorage.app",

    messagingSenderId:
        "727766561784",

    appId:
        "1:727766561784:web:4a6256de720befd2a25c0d",

    measurementId:
        "G-49F0VCKW1S"

};


const firebaseApp =
    initializeApp(firebaseConfig);

const auth =
    getAuth(firebaseApp);

const googleProvider =
    new GoogleAuthProvider();


googleProvider.setCustomParameters({
    prompt: "select_account"
});


/* =========================================================
   APP STATE
========================================================= */

const AppState = {

    loggedIn: false,

    authType: "guest",

    user: {

        name: "Guest Student",

        initial: "G",

        email: "",

        photo: "",

        uid: ""

    },

    selectedExam: "JEE Main",

    progress: 0,

    currentPage: "homePage"

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    document.querySelectorAll(selector);


/* =========================================================
   ELEMENTS
========================================================= */

const splashScreen =
    $("#splashScreen");

const welcomeScreen =
    $("#welcomeScreen");

const mainApp =
    $("#mainApp");

const loadingProgress =
    $("#loadingProgress");

const loadingText =
    $("#loadingText");

const guestLoginBtn =
    $("#guestLoginBtn");

const googleLoginBtn =
    $("#googleLoginBtn");

const googleButtonText =
    $("#googleButtonText");

const loginStatus =
    $("#loginStatus");

const profileBtn =
    $("#profileBtn");

const profileInitial =
    $("#profileInitial");

const largeProfileInitial =
    $("#largeProfileInitial");

const profileName =
    $("#profileName");

const profileEmail =
    $("#profileEmail");

const logoutBtn =
    $("#logoutBtn");

const overallProgress =
    $("#overallProgress");

const progressBar =
    $("#progressBar");

const predictorMarks =
    $("#predictorMarks");

const predictorExam =
    $("#predictorExam");

const predictorCategory =
    $("#predictorCategory");

const predictorGender =
    $("#predictorGender");

const predictBtn =
    $("#predictBtn");

const predictionResult =
    $("#predictionResult");

const predictedPercentile =
    $("#predictedPercentile");

const predictedRank =
    $("#predictedRank");

const predictedRange =
    $("#predictedRange");

const formulaSearch =
    $("#formulaSearch");

const formulaList =
    $("#formulaList");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    loadSavedData();

    setupNavigation();

    setupLogin();

    setupExamSelection();

    setupPredictor();

    setupFormulaSearch();

    setupBackButtons();

    setupLogout();

    updateProfileUI();

    updateProgressUI();

    startSplash();

    watchFirebaseAuth();

}


/* =========================================================
   SPLASH
========================================================= */

function startSplash() {

    let progress = 0;

    const messages = [

        "Initializing JEE MASTREY...",

        "Loading study engine...",

        "Preparing syllabus...",

        "Preparing formula bank...",

        "Preparing practice arena...",

        "Starting your journey..."

    ];


    const interval = setInterval(() => {

        progress +=
            Math.floor(Math.random() * 12) + 6;


        if (progress > 100) {
            progress = 100;
        }


        if (loadingProgress) {

            loadingProgress.style.width =
                `${progress}%`;

        }


        const index =
            Math.min(
                Math.floor(progress / 20),
                messages.length - 1
            );


        if (loadingText) {

            loadingText.textContent =
                messages[index];

        }


        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                if (AppState.loggedIn) {

                    showMainApp();

                } else {

                    showWelcome();

                }

            }, 400);

        }

    }, 220);

}


/* =========================================================
   SCREEN CONTROL
========================================================= */

function showWelcome() {

    splashScreen?.classList.add("hidden");

    welcomeScreen?.classList.remove("hidden");

    mainApp?.classList.add("hidden");

}


function showMainApp() {

    splashScreen?.classList.add("hidden");

    welcomeScreen?.classList.add("hidden");

    mainApp?.classList.remove("hidden");

    showPage(
        AppState.currentPage || "homePage"
    );

}


/* =========================================================
   FIREBASE AUTH STATE
========================================================= */

function watchFirebaseAuth() {

    onAuthStateChanged(
        auth,
        user => {

            if (!user) {

                return;

            }


            AppState.loggedIn = true;

            AppState.authType = "google";


            const name =
                user.displayName ||
                user.email?.split("@")[0] ||
                "Google Student";


            AppState.user = {

                name: name,

                initial:
                    getInitial(name),

                email:
                    user.email || "",

                photo:
                    user.photoURL || "",

                uid:
                    user.uid || ""

            };


            saveData();

            updateProfileUI();


            /*
                If login happened after
                the welcome screen was shown,
                open the app immediately.
            */

            showMainApp();

            setLoginStatus(
                `Welcome, ${name}!`,
                false
            );

        }
    );


    /*
        Handles redirect results if the browser
        was sent to Google and returned.
    */

    getRedirectResult(auth)
        .then(result => {

            if (!result) {
                return;
            }

            const user = result.user;

            if (!user) {
                return;
            }

            AppState.loggedIn = true;

            AppState.authType = "google";

            const name =
                user.displayName ||
                user.email?.split("@")[0] ||
                "Google Student";

            AppState.user = {

                name,

                initial:
                    getInitial(name),

                email:
                    user.email || "",

                photo:
                    user.photoURL || "",

                uid:
                    user.uid || ""

            };

            saveData();

            updateProfileUI();

            showMainApp();

        })
        .catch(error => {

            console.error(
                "Redirect login error:",
                error
            );

            showAuthError(error);

        });

}


/* =========================================================
   LOGIN
========================================================= */

function setupLogin() {


    /* ================= GUEST ================= */

    if (guestLoginBtn) {

        guestLoginBtn.addEventListener(
            "click",
            () => {

                AppState.loggedIn = true;

                AppState.authType = "guest";

                AppState.user = {

                    name: "Guest Student",

                    initial: "G",

                    email: "",

                    photo: "",

                    uid: ""

                };


                saveData();

                updateProfileUI();

                showMainApp();

                showToast(
                    "Guest mode activated"
                );

            }
        );

    }


    /* ================= GOOGLE ================= */

    if (googleLoginBtn) {

        googleLoginBtn.addEventListener(
            "click",
            googleLogin
        );

    }

}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

async function googleLogin() {

    if (!googleLoginBtn) {
        return;
    }


    googleLoginBtn.disabled = true;


    if (googleButtonText) {

        googleButtonText.textContent =
            "Connecting to Google...";

    }


    setLoginStatus(
        "Opening Google sign-in...",
        false
    );


    try {

        /*
            Popup is used first.

            This is Firebase's standard
            browser authentication method.
        */

        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        const user =
            result.user;


        if (!user) {

            throw new Error(
                "Google account was not returned."
            );

        }


        AppState.loggedIn = true;

        AppState.authType = "google";


        const name =
            user.displayName ||
            user.email?.split("@")[0] ||
            "Google Student";


        AppState.user = {

            name,

            initial:
                getInitial(name),

            email:
                user.email || "",

            photo:
                user.photoURL || "",

            uid:
                user.uid || ""

        };


        saveData();

        updateProfileUI();

        setLoginStatus(
            "Google sign-in successful!",
            false
        );


        showToast(
            `Welcome ${name}!`
        );


        setTimeout(
            showMainApp,
            300
        );


    } catch (error) {

        console.error(
            "Google sign-in failed:",
            error
        );


        /*
            On some mobile browsers / hosted
            environments popup authentication
            can fail.

            We then try redirect authentication.
        */

        if (
            error.code ===
                "auth/popup-blocked" ||

            error.code ===
                "auth/popup-closed-by-user" ||

            error.code ===
                "auth/cancelled-popup-request"
        ) {

            setLoginStatus(
                "Switching to Google redirect...",
                false
            );


            try {

                await signInWithRedirect(
                    auth,
                    googleProvider
                );

                return;

            } catch (redirectError) {

                console.error(
                    "Redirect failed:",
                    redirectError
                );

                showAuthError(
                    redirectError
                );

            }

        } else {

            showAuthError(error);

        }

    } finally {

        googleLoginBtn.disabled = false;


        if (googleButtonText) {

            googleButtonText.textContent =
                "Continue with Google";

        }

    }

}


/* =========================================================
   AUTH ERROR
========================================================= */

function showAuthError(error) {

    let message =
        "Google sign-in could not be completed.";


    switch (error?.code) {

        case "auth/operation-not-allowed":

            message =
                "Google Sign-In is not enabled in Firebase.";

            break;


        case "auth/unauthorized-domain":

            message =
                "This website domain is not authorized in Firebase.";

            break;


        case "auth/popup-blocked":

            message =
                "Google popup was blocked. Please allow popups.";

            break;


        case "auth/popup-closed-by-user":

            message =
                "Google sign-in was cancelled.";

            break;


        case "auth/network-request-failed":

            message =
                "Network error. Check your internet connection.";

            break;


        case "auth/invalid-api-key":

            message =
                "Firebase API configuration is invalid.";

            break;


        case "auth/internal-error":

            message =
                "Firebase returned an internal error.";

            break;

    }


    setLoginStatus(
        message,
        true
    );


    showToast(message);

}


/* =========================================================
   LOGIN STATUS
========================================================= */

function setLoginStatus(
    message,
    error = false
) {

    if (!loginStatus) {
        return;
    }


    loginStatus.textContent =
        message;


    loginStatus.classList.toggle(
        "error",
        error
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                if (
                    AppState.authType ===
                    "google"
                ) {

                    await signOut(auth);

                }


                AppState.loggedIn = false;

                AppState.authType = "guest";

                AppState.user = {

                    name: "Guest Student",

                    initial: "G",

                    email: "",

                    photo: "",

                    uid: ""

                };


                saveData();

                updateProfileUI();

                showWelcome();

                showToast(
                    "Signed out successfully"
                );

            } catch (error) {

                console.error(
                    "Sign out error:",
                    error
                );

                showToast(
                    "Unable to sign out."
                );

            }

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    $$(".nav-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;

                    if (page) {

                        showPage(page);

                    }

                }
            );

        });


    $$(".quick-card")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;

                    if (page) {

                        showPage(page);

                    }

                }
            );

        });


    if (profileBtn) {

        profileBtn.addEventListener(
            "click",
            () => {

                showPage(
                    "profilePage"
                );

            }
        );

    }

}


function showPage(pageId) {

    $$(".page")
        .forEach(page => {

            page.classList.remove(
                "active-page"
            );

            page.classList.add(
                "hidden-page"
            );

        });


    const target =
        document.getElementById(pageId);


    if (!target) {
        return;
    }


    target.classList.remove(
        "hidden-page"
    );

    target.classList.add(
        "active-page"
    );


    AppState.currentPage =
        pageId;


    updateNavigation(
        pageId
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    saveData();

}


function updateNavigation(pageId) {

    $$(".nav-item")
        .forEach(item => {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.page ===
                pageId
            ) {

                item.classList.add(
                    "active"
                );

            }

        });

}


/* =========================================================
   BACK
========================================================= */

function setupBackButtons() {

    $$(".back-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showPage(
                        "homePage"
                    );

                }
            );

        });

}


/* =========================================================
   EXAM SELECTION
========================================================= */

function setupExamSelection() {

    $$(".exam-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const exam =
                        card.dataset.exam;

                    if (!exam) {
                        return;
                    }


                    AppState.selectedExam =
                        exam;


                    saveData();


                    showToast(
                        `${exam} selected`
                    );


                    showPage(
                        "testsPage"
                    );

                }
            );

        });

}


/* =========================================================
   PROFILE
========================================================= */

function getInitial(name) {

    if (!name) {
        return "G";
    }


    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


function updateProfileUI() {

    const name =
        AppState.user.name ||
        "Guest Student";


    const initial =
        AppState.user.initial ||
        getInitial(name);


    if (profileInitial) {

        profileInitial.textContent =
            initial;

    }


    if (largeProfileInitial) {

        largeProfileInitial.textContent =
            initial;

    }


    if (profileName) {

        profileName.textContent =
            name;

    }


    if (profileEmail) {

        profileEmail.textContent =
            AppState.user.email ||
            "Guest Student";

    }

}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgressUI() {

    const progress =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    AppState.progress
                ) || 0
            )
        );


    if (overallProgress) {

        overallProgress.textContent =
            `${progress}%`;

    }


    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;

    }


    const circle =
        $(".progress-circle");


    if (circle) {

        circle.style.background =
            `conic-gradient(
                var(--secondary)
                ${progress * 3.6}deg,
                rgba(255,255,255,0.08)
                ${progress * 3.6}deg
            )`;


        const text =
            circle.querySelector("span");


        if (text) {

            text.textContent =
                progress;

        }

    }

}


function increaseProgress(
    amount = 1
) {

    AppState.progress +=
        amount;


    if (
        AppState.progress > 100
    ) {

        AppState.progress =
            100;

    }


    saveData();

    updateProgressUI();

}


/* =========================================================
   PREDICTOR
========================================================= */

function setupPredictor() {

    if (!predictBtn) {
        return;
    }


    predictBtn.addEventListener(
        "click",
        () => {

            const marks =
                Number(
                    predictorMarks.value
                );


            if (
                !Number.isFinite(marks) ||
                marks < 0
            ) {

                showToast(
                    "Please enter valid marks."
                );

                predictorMarks.focus();

                return;

            }


            let result;


            if (
                predictorExam.value ===
                "jee-main"
            ) {

                result =
                    calculateJeeMainPrediction(
                        marks
                    );

            } else {

                result =
                    calculateJeeAdvancedPrediction(
                        marks
                    );

            }


            displayPrediction(
                result
            );


            increaseProgress(1);

        }
    );

}


function calculateJeeMainPrediction(
    marks
) {

    const maxMarks = 300;


    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                (marks / maxMarks) * 100
            )
        );


    let percentile;


    if (percentage >= 95) {

        percentile =
            99.90 +
            ((percentage - 95) / 5) *
            0.09;

    } else if (percentage >= 85) {

        percentile =
            99.0 +
            ((percentage - 85) / 10) *
            0.9;

    } else if (percentage >= 70) {

        percentile =
            95.0 +
            ((percentage - 70) / 15) *
            4;

    } else if (percentage >= 50) {

        percentile =
            80.0 +
            ((percentage - 50) / 20) *
            15;

    } else {

        percentile =
            Math.max(
                1,
                percentage * 1.6
            );

    }


    percentile =
        Math.min(
            99.99,
            Math.max(
                1,
                percentile
            )
        );


    const candidates =
        1500000;


    const rank =
        Math.max(
            1,
            Math.round(
                candidates *
                (1 - percentile / 100)
            )
        );


    return {

        percentile,

        rank,

        rangeLow:
            Math.max(
                1,
                Math.round(
                    rank * 0.85
                )
            ),

        rangeHigh:
            Math.round(
                rank * 1.15
            )

    };

}


function calculateJeeAdvancedPrediction(
    marks
) {

    const maxMarks = 360;


    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                (marks / maxMarks) * 100
            )
        );


    const percentile =
        Math.max(
            1,
            Math.min(
                99.99,
                percentage * 0.95
            )
        );


    const candidates =
        200000;


    const rank =
        Math.max(
            1,
            Math.round(
                candidates *
                (1 - percentile / 100)
            )
        );


    return {

        percentile,

        rank,

        rangeLow:
            Math.max(
                1,
                Math.round(
                    rank * 0.85
                )
            ),

        rangeHigh:
            Math.round(
                rank * 1.15
            )

    };

}


function displayPrediction(
    result
) {

    if (!predictionResult) {
        return;
    }


    predictedPercentile.textContent =
        result.percentile.toFixed(2);


    predictedRank.textContent =
        result.rank.toLocaleString();


    predictedRange.textContent =
        `${result.rangeLow.toLocaleString()} – ${result.rangeHigh.toLocaleString()}`;


    predictionResult.classList.remove(
        "hidden"
    );


    predictionResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   FORMULA DATABASE
========================================================= */

const formulaDatabase = [

    {
        formula: "F = ma",
        name: "Newton's Second Law",
        subject: "Physics"
    },

    {
        formula: "v = u + at",
        name: "Equation of Motion",
        subject: "Physics"
    },

    {
        formula: "s = ut + ½at²",
        name: "Equation of Motion",
        subject: "Physics"
    },

    {
        formula: "v² = u² + 2as",
        name: "Equation of Motion",
        subject: "Physics"
    },

    {
        formula: "p = mv",
        name: "Linear Momentum",
        subject: "Physics"
    },

    {
        formula: "W = Fs cosθ",
        name: "Work Done",
        subject: "Physics"
    },

    {
        formula: "P = W/t",
        name: "Power",
        subject: "Physics"
    },

    {
        formula: "E = mc²",
        name: "Mass Energy Relation",
        subject: "Physics"
    },

    {
        formula: "PV = nRT",
        name: "Ideal Gas Equation",
        subject: "Chemistry"
    },

    {
        formula: "pH = -log[H⁺]",
        name: "pH",
        subject: "Chemistry"
    },

    {
        formula: "n = m/M",
        name: "Number of Moles",
        subject: "Chemistry"
    },

    {
        formula: "a² + b² = c²",
        name: "Pythagorean Theorem",
        subject: "Mathematics"
    },

    {
        formula: "sin²θ + cos²θ = 1",
        name: "Trigonometric Identity",
        subject: "Mathematics"
    },

    {
        formula: "d/dx(xⁿ) = nxⁿ⁻¹",
        name: "Power Rule",
        subject: "Mathematics"
    }

];


function setupFormulaSearch() {

    if (!formulaSearch) {
        return;
    }


    formulaSearch.addEventListener(
        "input",
        () => {

            const query =
                formulaSearch.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                renderFormulas(
                    formulaDatabase
                );

                return;

            }


            const filtered =
                formulaDatabase.filter(
                    item =>

                        item.formula
                            .toLowerCase()
                            .includes(query)

                        ||

                        item.name
                            .toLowerCase()
                            .includes(query)

                        ||

                        item.subject
                            .toLowerCase()
                            .includes(query)

                );


            renderFormulas(
                filtered
            );

        }
    );

}


function renderFormulas(items) {

    if (!formulaList) {
        return;
    }


    if (!items.length) {

        formulaList.innerHTML = `

            <div class="formula-item">

                <span>
                    No formula found
                </span>

                <small>
                    Try another search.
                </small>

            </div>

        `;

        return;

    }


    formulaList.innerHTML =
        items.map(item => `

            <div class="formula-item">

                <span>
                    ${escapeHTML(
                        item.formula
                    )}
                </span>

                <small>
                    ${escapeHTML(
                        item.name
                    )}
                    •
                    ${escapeHTML(
                        item.subject
                    )}
                </small>

            </div>

        `).join("");

}


/* =========================================================
   SAFE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const old =
        document.querySelector(
            ".app-toast"
        );


    if (old) {
        old.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "app-toast";


    toast.textContent =
        message;


    Object.assign(
        toast.style,
        {

            position: "fixed",

            left: "50%",

            bottom: "100px",

            transform:
                "translateX(-50%) translateY(20px)",

            zIndex: "9999",

            padding: "12px 18px",

            borderRadius: "14px",

            background:
                "rgba(20,25,50,0.96)",

            border:
                "1px solid rgba(255,255,255,0.12)",

            color: "#fff",

            fontSize: "11px",

            fontWeight: "700",

            boxShadow:
                "0 15px 40px rgba(0,0,0,0.35)",

            opacity: "0",

            transition:
                "all 0.25s ease",

            maxWidth: "85vw",

            textAlign: "center"

        }
    );


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(() => {

        toast.style.opacity =
            "1";

        toast.style.transform =
            "translateX(-50%) translateY(0)";

    });


    setTimeout(() => {

        toast.style.opacity =
            "0";

        toast.style.transform =
            "translateX(-50%) translateY(10px)";

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function saveData() {

    try {

        localStorage.setItem(
            "JEE_MASTREY_PRO_STATE",
            JSON.stringify(
                AppState
            )
        );

    } catch (error) {

        console.warn(
            "Unable to save app state.",
            error
        );

    }

}


function loadSavedData() {

    try {

        const saved =
            localStorage.getItem(
                "JEE_MASTREY_PRO_STATE"
            );


        if (!saved) {
            return;
        }


        const data =
            JSON.parse(saved);


        if (
            data &&
            typeof data ===
            "object"
        ) {

            if (
                typeof data.loggedIn ===
                "boolean"
            ) {

                AppState.loggedIn =
                    data.loggedIn;

            }


            if (data.authType) {

                AppState.authType =
                    data.authType;

            }


            if (data.user) {

                AppState.user = {

                    ...AppState.user,

                    ...data.user

                };

            }


            if (data.selectedExam) {

                AppState.selectedExam =
                    data.selectedExam;

            }


            if (
                Number.isFinite(
                    Number(
                        data.progress
                    )
                )
            ) {

                AppState.progress =
                    Number(
                        data.progress
                    );

            }


            if (data.currentPage) {

                AppState.currentPage =
                    data.currentPage;

            }

        }

    } catch (error) {

        console.warn(
            "Saved data could not be loaded.",
            error
        );

    }

}


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            if (
                mainApp &&
                !mainApp.classList.contains(
                    "hidden"
                )
            ) {

                showPage(
                    "homePage"
                );

            }

        }

    }
);


/* =========================================================
   DOUBLE TAP
========================================================= */

let lastTouchEnd = 0;


document.addEventListener(
    "touchend",
    event => {

        const now =
            Date.now();


        if (
            now - lastTouchEnd <=
            300
        ) {

            event.preventDefault();

        }


        lastTouchEnd =
            now;

    },
    {
        passive: false
    }
);


/* =========================================================
   READY
========================================================= */

console.log(
    "JEE MASTREY PRO + Firebase initialized."
);
