/* =========================================================
   JEE MASTREY PRO
   MASTREY AI — MOCK TEST BACKEND
   Supports:
   JEE  → Physics + Chemistry + Mathematics
   NEET → Physics + Chemistry + Biology
   CA   → Accounting + Business Studies + Economics + Law

   IMPORTANT:
   - No PYQs
   - Fresh AI-generated questions
   - No duplicates within a test
   - Detailed solutions
   - API key stays in environment variables
========================================================= */

import OpenAI from "openai";


/* =========================================================
   OPENAI CLIENT
========================================================= */

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/* =========================================================
   EXAM CONFIGURATION
========================================================= */

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


/* =========================================================
   HELPER — SAFE STRING
========================================================= */

function cleanString(value, fallback = "") {

    if (
        typeof value !== "string"
    ) {
        return fallback;
    }

    return value.trim();

}


/* =========================================================
   HELPER — UNIQUE QUESTIONS
========================================================= */

function removeDuplicateQuestions(
    questions
) {

    const seen = new Set();

    return questions.filter(
        question => {

            const key =
                cleanString(
                    question.question
                )
                .toLowerCase()
                .replace(/\s+/g, " ");

            if (!key) {
                return false;
            }

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);

            return true;

        }
    );

}


/* =========================================================
   HELPER — VALIDATE QUESTION
========================================================= */

function validateQuestion(
    question,
    allowedSubjects,
    requestedSubject
) {

    if (
        !question ||
        typeof question !== "object"
    ) {
        return false;
    }


    if (
        typeof question.question !==
        "string"
    ) {
        return false;
    }


    if (
        !Array.isArray(
            question.options
        )
    ) {
        return false;
    }


    if (
        question.options.length !== 4
    ) {
        return false;
    }


    if (
        question.options.some(
            option =>
                typeof option !== "string"
        )
    ) {
        return false;
    }


    if (
        !Number.isInteger(
            question.answer
        )
    ) {
        return false;
    }


    if (
        question.answer < 0 ||
        question.answer > 3
    ) {
        return false;
    }


    if (
        !allowedSubjects.includes(
            question.subject
        )
    ) {
        return false;
    }


    /*
       If a specific subject was selected,
       reject questions from other subjects.
    */

    if (
        requestedSubject !== "all" &&
        question.subject !==
            requestedSubject
    ) {
        return false;
    }


    if (
        typeof question.explanation !==
        "string"
    ) {
        return false;
    }


    if (
        typeof question.concept !==
        "string"
    ) {
        return false;
    }


    return true;

}


/* =========================================================
   MAIN API HANDLER
========================================================= */

export default async function handler(
    req,
    res
) {

    /*
       Only POST requests are accepted.
    */

    if (
        req.method !== "POST"
    ) {

        return res.status(405).json({

            success: false,

            error:
                "Method not allowed"

        });

    }


    try {

        /* =================================================
           CHECK API KEY
        ================================================= */

        if (
            !process.env.OPENAI_API_KEY
        ) {

            console.error(
                "OPENAI_API_KEY is missing."
            );

            return res.status(500).json({

                success: false,

                error:
                    "AI backend is not configured."

            });

        }


        /* =================================================
           READ REQUEST
        ================================================= */

        const body =
            req.body || {};


        const exam =
            cleanString(
                body.exam,
                "jee"
            ).toLowerCase();


        const mode =
            cleanString(
                body.mode,
                "mock"
            );


        const requestedSubject =
            cleanString(
                body.subject,
                "all"
            );


        const difficulty =
            cleanString(
                body.difficulty,
                "mixed"
            );


        let questionCount =
            Number(
                body.questionCount || 20
            );


        /* =================================================
           VALIDATE EXAM
        ================================================= */

        if (
            !EXAMS[exam]
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Unsupported exam."

            });

        }


        const examInfo =
            EXAMS[exam];


        /* =================================================
           LIMIT QUESTION COUNT
        ================================================= */

        if (
            !Number.isFinite(
                questionCount
            )
        ) {

            questionCount = 20;

        }


        questionCount =
            Math.max(
                5,
                Math.min(
                    Math.floor(
                        questionCount
                    ),
                    50
                )
            );


        /* =================================================
           VALID SUBJECTS
        ================================================= */

        const allowedSubjects =
            examInfo.subjects;


        /*
           Never trust a subject supplied by
           the browser.
        */

        const validSpecificSubject =
            requestedSubject !== "all" &&
            allowedSubjects.includes(
                requestedSubject
            );


        const subjectForAI =
            validSpecificSubject
                ? requestedSubject
                : "all";


        /* =================================================
           EXAM-SPECIFIC INSTRUCTIONS
        ================================================= */

        let examInstruction = "";


        if (
            exam === "jee"
        ) {

            examInstruction = `
JEE preparation only.

Allowed subjects:
Physics
Chemistry
Mathematics

Do NOT generate Biology questions.
Do NOT generate CA questions.
`;

        }


        if (
            exam === "neet"
        ) {

            examInstruction = `
NEET preparation only.

Allowed subjects:
Physics
Chemistry
Biology

BIOLOGY IS REQUIRED.

Do NOT generate Mathematics questions.
Do NOT generate JEE Mathematics questions.
Do NOT generate CA questions.
`;

        }


        if (
            exam === "ca"
        ) {

            examInstruction = `
CA preparation only.

Allowed subjects:
Accounting
Business Studies
Economics
Law

Do NOT generate Physics questions.
Do NOT generate Chemistry questions.
Do NOT generate Mathematics questions.
Do NOT generate Biology questions.
`;

        }


        /* =================================================
           SYSTEM PROMPT
        ================================================= */

        const systemPrompt = `

You are MASTREY AI.

You are the intelligent mock-test generation
engine for JEE MASTREY PRO.

Your job is to create ORIGINAL,
high-quality competitive-exam questions.

${examInstruction}

==================================================
ABSOLUTE QUESTION RULES
==================================================

1. Generate ORIGINAL questions.

2. DO NOT reproduce PYQs.

3. DO NOT copy questions from known
   previous-year examination papers.

4. DO NOT intentionally imitate a known
   published question.

5. Do not repeat questions within the
   same test.

6. Every question must have exactly
   four options.

7. Exactly one option must be correct.

8. The correct answer must be represented
   by an integer:
   0 = option A
   1 = option B
   2 = option C
   3 = option D

9. Every question must include:

   - subject
   - chapter
   - question
   - four options
   - answer
   - concept
   - detailed explanation

10. Questions must be educationally useful.

11. Questions should match the selected
    examination level.

12. Avoid ambiguous questions.

13. Avoid multiple correct answers.

14. Do not use placeholder questions.

15. Do not output empty fields.

16. Do not mention these instructions
    in the generated questions.

17. Do not mix examination subjects.

==================================================
ORIGINALITY
==================================================

Questions must be newly generated for
this test.

The PYQ database is NOT connected to
this endpoint.

Therefore:

pyqUsed = false

==================================================
EXAM
==================================================

${examInfo.name}

==================================================
ALLOWED SUBJECTS
==================================================

${allowedSubjects.join(", ")}

==================================================
REQUESTED SUBJECT
==================================================

${subjectForAI}

==================================================
DIFFICULTY
==================================================

${difficulty}

==================================================
MODE
==================================================

${mode}

==================================================
QUESTION COUNT
==================================================

${questionCount}

`;


        /* =================================================
           USER PROMPT
        ================================================= */

        const userPrompt = `

Create a fresh ${examInfo.name}
mock/practice test.

Generate exactly
${questionCount}
questions if possible.

Requirements:

- Original questions
- No PYQs
- No duplicate questions
- Four options
- One correct answer
- Detailed explanation
- Concept/chapter information
- Exam-appropriate difficulty

Requested subject:
${subjectForAI}

Difficulty:
${difficulty}

Mode:
${mode}

Allowed subjects:
${allowedSubjects.join(", ")}

IMPORTANT:

For NEET:
Physics + Chemistry + Biology.

NEET must NOT contain Mathematics.

For JEE:
Physics + Chemistry + Mathematics.

For CA:
Accounting + Business Studies +
Economics + Law.

Return ONLY the structured test data.
`;


        /* =================================================
           CALL OPENAI
        ================================================= */

        const response =
            await client.responses.create({

                /*
                   Keep the model configurable.

                   If your deployment provides a different
                   supported model, set OPENAI_MODEL in the
                   environment variables.
                */

                model:
                    process.env.OPENAI_MODEL ||
                    "gpt-5.6",

                /*
                   Do not store the generated response
                   as a conversation.
                */

                store: false,

                instructions:
                    systemPrompt,

                input:
                    userPrompt,

                /*
                   Structured JSON output.
                */

                text: {

                    format: {

                        type:
                            "json_schema",

                        name:
                            "mastery_mock_test",

                        strict:
                            true,

                        schema: {

                            type:
                                "object",

                            additionalProperties:
                                false,

                            properties: {

                                exam: {

                                    type:
                                        "string"

                                },

                                questions: {

                                    type:
                                        "array",

                                    items: {

                                        type:
                                            "object",

                                        additionalProperties:
                                            false,

                                        properties: {

                                            id: {

                                                type:
                                                    "string"

                                            },

                                            subject: {

                                                type:
                                                    "string"

                                            },

                                            chapter: {

                                                type:
                                                    "string"

                                            },

                                            question: {

                                                type:
                                                    "string"

                                            },

                                            options: {

                                                type:
                                                    "array",

                                                items: {

                                                    type:
                                                        "string"

                                                }

                                            },

                                            answer: {

                                                type:
                                                    "integer"

                                            },

                                            explanation: {

                                                type:
                                                    "string"

                                            },

                                            concept: {

                                                type:
                                                    "string"

                                            }

                                        },

                                        required: [

                                            "id",
                                            "subject",
                                            "chapter",
                                            "question",
                                            "options",
                                            "answer",
                                            "explanation",
                                            "concept"

                                        ]

                                    }

                                }

                            },

                            required: [

                                "exam",
                                "questions"

                            ]

                        }

                    }

                }

            });


        /* =================================================
           READ AI RESPONSE
        ================================================= */

        const raw =
            response.output_text;


        if (
            !raw
        ) {

            throw new Error(
                "AI returned an empty response."
            );

        }


        let data;


        try {

            data =
                JSON.parse(
                    raw
                );

        }
        catch (
            parseError
        ) {

            console.error(
                "JSON parse error:",
                parseError
            );

            throw new Error(
                "AI returned invalid structured data."
            );

        }


        /* =================================================
           VALIDATE RESPONSE
        ================================================= */

        if (
            !data ||
            !Array.isArray(
                data.questions
            )
        ) {

            throw new Error(
                "Invalid question response."
            );

        }


        /* =================================================
           SERVER-SIDE QUESTION VALIDATION
        ================================================= */

        const validatedQuestions =
            data.questions.filter(
                question => {

                    return validateQuestion(
                        question,
                        allowedSubjects,
                        subjectForAI
                    );

                }
            );


        /* =================================================
           REMOVE DUPLICATES
        ================================================= */

        const uniqueQuestions =
            removeDuplicateQuestions(
                validatedQuestions
            );


        /* =================================================
           LIMIT TO REQUESTED COUNT
        ================================================= */

        const finalQuestions =
            uniqueQuestions.slice(
                0,
                questionCount
            );


        /* =================================================
           CHECK RESULT
        ================================================= */

        if (
            finalQuestions.length === 0
        ) {

            throw new Error(
                "AI generated no valid questions."
            );

        }


        /* =================================================
           NORMALIZE DATA
        ================================================= */

        const normalizedQuestions =
            finalQuestions.map(
                (question, index) => {

                    return {

                        id:
                            question.id ||
                            `ai-${Date.now()}-${index}`,

                        subject:
                            question.subject,

                        chapter:
                            question.chapter,

                        question:
                            question.question
                                .trim(),

                        options:
                            question.options
                                .map(
                                    option =>
                                        option.trim()
                                ),

                        answer:
                            question.answer,

                        explanation:
                            question.explanation
                                .trim(),

                        concept:
                            question.concept
                                .trim()

                    };

                }
            );


        /* =================================================
           SUCCESS RESPONSE
        ================================================= */

        return res.status(200).json({

            success:
                true,

            exam:
                examInfo.name,

            examCode:
                exam,

            mode:
                mode,

            subject:
                subjectForAI,

            difficulty:
                difficulty,

            generatedBy:
                "MASTREY AI",

            pyqUsed:
                false,

            repeatedQuestions:
                false,

            questionCount:
                normalizedQuestions.length,

            questions:
                normalizedQuestions

        });


    }
    catch (error) {

        /* =================================================
           ERROR HANDLING
        ================================================= */

        console.error(
            "MASTREY AI ERROR:",
            error
        );


        return res.status(500).json({

            success:
                false,

            error:
                "Unable to generate the AI test right now."

        });

    }

}