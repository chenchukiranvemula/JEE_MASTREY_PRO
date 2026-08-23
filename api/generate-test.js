/* =========================================================
   JEE MASTREY PRO
   AI MOCK TEST BACKEND
   Vercel Serverless Function

   JEE + NEET + CA
   SUBJECT + CHAPTER + TOPIC
   ORIGINAL AI QUESTIONS
========================================================= */

export default async function handler(req, res) {

    /* =====================================================
       CORS
    ===================================================== */

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Only POST requests are allowed."
        });
    }


    /* =====================================================
       API KEY
    ===================================================== */

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            success: false,
            error:
                "OPENAI_API_KEY is not configured in Vercel."
        });
    }


    /* =====================================================
       REQUEST
    ===================================================== */

    let body = {};

    try {

        body =
            typeof req.body === "string"
                ? JSON.parse(req.body)
                : (req.body || {});

    } catch (error) {

        return res.status(400).json({
            success: false,
            error: "Invalid request body."
        });
    }


    /* =====================================================
       INPUTS
    ===================================================== */

    const exam =
        String(body.exam || "jee")
            .trim()
            .toLowerCase();

    const subject =
        String(body.subject || "all")
            .trim();

    const chapter =
        String(body.chapter || "all")
            .trim();

    const topic =
        String(body.topic || "all")
            .trim();

    const difficulty =
        String(body.difficulty || "mixed")
            .trim()
            .toLowerCase();

    const questionCount =
        Math.min(
            Math.max(
                Number(body.questionCount) || 5,
                1
            ),
            30
        );


    /* =====================================================
       SUBJECTS
    ===================================================== */

    const subjects = {

        jee: [
            "Physics",
            "Chemistry",
            "Mathematics"
        ],

        neet: [
            "Physics",
            "Chemistry",
            "Biology"
        ],

        ca: [
            "Accounting",
            "Business Studies",
            "Economics",
            "Law"
        ]

    };


    /* =====================================================
       VALIDATE EXAM
    ===================================================== */

    if (!subjects[exam]) {

        return res.status(400).json({
            success: false,
            error: "Invalid examination."
        });
    }


    /* =====================================================
       VALIDATE SUBJECT
    ===================================================== */

    if (
        subject !== "all" &&
        !subjects[exam].includes(subject)
    ) {

        return res.status(400).json({
            success: false,
            error:
                `${subject} is not available for ${exam.toUpperCase()}.`
        });
    }


    /* =====================================================
       NEET SAFETY
    ===================================================== */

    if (
        exam === "neet" &&
        subject === "Mathematics"
    ) {

        return res.status(400).json({
            success: false,
            error:
                "NEET uses Biology instead of Mathematics."
        });
    }


    /* =====================================================
       SUBJECT
    ===================================================== */

    const subjectInstruction =
        subject === "all"

            ? `Questions may use:
${subjects[exam].join(", ")}.`

            : `Questions MUST be from:
${subject}.`;


    /* =====================================================
       CHAPTER
    ===================================================== */

    const chapterInstruction =
        chapter === "all"

            ? "Choose suitable chapters from the selected subject."

            : `Use ONLY this chapter:
${chapter}.`;


    /* =====================================================
       TOPIC
    ===================================================== */

    const topicInstruction =
        topic === "all"

            ? "Choose suitable topics from the selected chapter."

            : `Use ONLY this topic:
${topic}.`;


    /* =====================================================
       EXAM RULES
    ===================================================== */

    let examInstruction = "";


    if (exam === "jee") {

        examInstruction = `
EXAMINATION: JEE

Subjects:
Physics
Chemistry
Mathematics

Generate questions appropriate for JEE Main
and JEE Advanced preparation.

Use conceptual, numerical and application-based
questions where appropriate.
`;
    }


    if (exam === "neet") {

        examInstruction = `
EXAMINATION: NEET

Subjects:
Physics
Chemistry
Biology

IMPORTANT:
NEET DOES NOT HAVE MATHEMATICS.

For Biology use NCERT-oriented Botany
and Zoology concepts.

Never generate Mathematics for NEET.
`;
    }


    if (exam === "ca") {

        examInstruction = `
EXAMINATION: CA

Subjects:
Accounting
Business Studies
Economics
Law

Generate examination-oriented questions
appropriate for CA preparation.
`;
    }


    /* =====================================================
       SYSTEM PROMPT
    ===================================================== */

    const systemPrompt = `
You are MASTREY AI,
the AI question engine of JEE MASTREY PRO.

Your job is to create ORIGINAL practice questions.

IMPORTANT RULES:

1. NEVER generate PYQs.
2. NEVER copy known exam questions.
3. NEVER copy textbook questions word-for-word.
4. Create fresh questions with new values,
   scenarios and wording.
5. Never intentionally repeat questions.
6. Follow the selected exam.
7. Follow the selected subject.
8. Follow the selected chapter.
9. Follow the selected topic.
10. Every question has exactly FOUR options.
11. Exactly ONE option is correct.
12. Answer must be 0, 1, 2 or 3.
13. Give detailed solutions.
14. Give the tested concept.
15. Avoid ambiguous questions.
16. Avoid multiple correct answers.
17. Avoid impossible questions.
18. Respect the requested difficulty.
19. Return ONLY valid JSON.
20. Do not use markdown.
21. Do not add explanations outside JSON.

${examInstruction}

${subjectInstruction}

${chapterInstruction}

${topicInstruction}

DIFFICULTY:
${difficulty}

Generate exactly ${questionCount} questions.
`;


    /* =====================================================
       USER PROMPT
    ===================================================== */

    const userPrompt = `
Create a completely fresh ${exam.toUpperCase()} practice test.

Subject:
${subject}

Chapter:
${chapter}

Topic:
${topic}

Difficulty:
${difficulty}

Questions:
${questionCount}

Return exactly this structure:

{
  "questions": [
    {
      "id": 1,
      "subject": "Physics",
      "chapter": "Electrostatics",
      "topic": "Electric Field",
      "difficulty": "medium",
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": 0,
      "concept": "Concept tested",
      "explanation": "Detailed step-by-step solution"
    }
  ]
}

Answer index:

A = 0
B = 1
C = 2
D = 3

Return JSON only.
`;


    /* =====================================================
       OPENAI
    ===================================================== */

    try {

        const response =
            await fetch(
                "https://api.openai.com/v1/chat/completions",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${apiKey}`

                    },

                    body: JSON.stringify({

                        model:
                            "gpt-4o-mini",

                        temperature:
                            0.8,

                        response_format: {
                            type:
                                "json_object"
                        },

                        messages: [

                            {
                                role:
                                    "system",

                                content:
                                    systemPrompt
                            },

                            {
                                role:
                                    "user",

                                content:
                                    userPrompt
                            }

                        ]

                    })

                }
            );


        /* =================================================
           OPENAI ERROR
        ================================================= */

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "OPENAI API ERROR:",
                errorText
            );

            return res.status(500).json({

                success: false,

                error:
                    "OpenAI request failed.",

                details:
                    errorText

            });
        }


        /* =================================================
           RESPONSE
        ================================================= */

        const data =
            await response.json();


        const content =
            data
                ?.choices
                ?.[0]
                ?.message
                ?.content;


        if (!content) {

            return res.status(500).json({

                success: false,

                error:
                    "AI returned an empty response."
            });
        }


        /* =================================================
           PARSE
        ================================================= */

        let parsed;

        try {

            parsed =
                JSON.parse(content);

        } catch (error) {

            console.error(
                "AI JSON ERROR:",
                content
            );

            return res.status(500).json({

                success: false,

                error:
                    "AI returned invalid question data."
            });
        }


        /* =================================================
           VALIDATE
        ================================================= */

        if (
            !parsed ||
            !Array.isArray(
                parsed.questions
            )
        ) {

            return res.status(500).json({

                success: false,

                error:
                    "AI response contains no questions."
            });
        }


        const seen =
            new Set();

        const questions = [];


        for (
            const q of parsed.questions
        ) {

            if (
                !q ||
                typeof q.question !==
                    "string"
            ) {
                continue;
            }


            if (
                !Array.isArray(q.options) ||
                q.options.length !== 4
            ) {
                continue;
            }


            if (
                q.options.some(
                    option =>
                        typeof option !==
                        "string"
                )
            ) {
                continue;
            }


            const answer =
                Number(q.answer);


            if (
                !Number.isInteger(answer) ||
                answer < 0 ||
                answer > 3
            ) {
                continue;
            }


            if (
                !subjects[exam]
                    .includes(q.subject)
            ) {
                continue;
            }


            if (
                subject !== "all" &&
                q.subject !== subject
            ) {
                continue;
            }


            const questionText =
                q.question
                    .trim();


            const duplicateKey =
                questionText
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        " "
                    );


            if (
                seen.has(
                    duplicateKey
                )
            ) {
                continue;
            }


            seen.add(
                duplicateKey
            );


            questions.push({

                id:
                    questions.length + 1,

                subject:
                    q.subject,

                chapter:
                    q.chapter ||
                    chapter,

                topic:
                    q.topic ||
                    topic,

                difficulty:
                    q.difficulty ||
                    difficulty,

                question:
                    questionText,

                options:
                    q.options.map(
                        option =>
                            option.trim()
                    ),

                answer,

                concept:
                    q.concept ||
                    "Core concept",

                explanation:
                    q.explanation ||
                    "Detailed solution not provided."

            });

        }


        /* =================================================
           EMPTY TEST
        ================================================= */

        if (
            questions.length === 0
        ) {

            return res.status(500).json({

                success: false,

                error:
                    "AI generated no valid questions."
            });
        }


        /* =================================================
           SUCCESS
        ================================================= */

        return res.status(200).json({

            success: true,

            exam,

            subject,

            chapter,

            topic,

            difficulty,

            questionCount:
                questions.length,

            questions

        });


    } catch (error) {

        console.error(
            "BACKEND ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            error:
                "Unable to connect to OpenAI."
        });
    }
                                    }
