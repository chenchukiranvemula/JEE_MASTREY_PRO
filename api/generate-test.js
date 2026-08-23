/* =========================================================
   JEE MASTREY PRO
   AI MOCK TEST BACKEND
   Vercel Serverless Function

   JEE + NEET + CA
   Subject + Chapter + Topic
   Original AI Questions
   Results + Detailed Solutions
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

        console.error(
            "OPENAI_API_KEY is missing."
        );

        return res.status(500).json({
            success: false,
            error:
                "OPENAI_API_KEY is not configured in Vercel."
        });
    }


    /* =====================================================
       READ REQUEST
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
            error: "Invalid request data."
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
                Number(body.questionCount) || 10,
                1
            ),
            30
        );


    /* =====================================================
       EXAM SUBJECTS
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
            error:
                "Invalid examination selected."
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
       SPECIAL NEET RULE
    ===================================================== */

    if (
        exam === "neet" &&
        subject === "Mathematics"
    ) {

        return res.status(400).json({
            success: false,
            error:
                "NEET does not use Mathematics. Biology is the correct subject."
        });
    }


    /* =====================================================
       SUBJECT INSTRUCTION
    ===================================================== */

    let subjectInstruction;

    if (subject === "all") {

        subjectInstruction =
            `Distribute the questions across:
${subjects[exam].join(", ")}.`;

    } else {

        subjectInstruction =
            `Generate questions ONLY from:
${subject}.`;
    }


    /* =====================================================
       CHAPTER / TOPIC INSTRUCTION
    ===================================================== */

    let chapterInstruction;

    if (chapter === "all") {

        chapterInstruction =
            "You may select appropriate chapters from the selected subject.";

    } else {

        chapterInstruction =
            `Use ONLY this chapter:
${chapter}.`;
    }


    let topicInstruction;

    if (topic === "all") {

        topicInstruction =
            "Use appropriate topics from the selected chapter.";

    } else {

        topicInstruction =
            `Use ONLY this topic:
${topic}.`;
    }


    /* =====================================================
       EXAM INSTRUCTIONS
    ===================================================== */

    let examInstruction = "";


    if (exam === "jee") {

        examInstruction = `
EXAM: JEE

Subjects:
Physics
Chemistry
Mathematics

Generate questions suitable for JEE Main / JEE Advanced preparation.

Questions may be:
- conceptual
- numerical
- application based
- multi-step

Do not use material outside the requested syllabus.
`;
    }


    if (exam === "neet") {

        examInstruction = `
EXAM: NEET

Subjects:
Physics
Chemistry
Biology

IMPORTANT:
NEET uses BIOLOGY.
NEET DOES NOT USE MATHEMATICS.

Biology questions should be strongly aligned with
NCERT-oriented Botany and Zoology concepts.

Do not generate Mathematics questions.
`;
    }


    if (exam === "ca") {

        examInstruction = `
EXAM: CA

Subjects:
Accounting
Business Studies
Economics
Law

Generate questions appropriate for CA preparation.

Questions should test understanding,
application and examination-oriented concepts.
`;
    }


    /* =====================================================
       SYSTEM PROMPT
    ===================================================== */

    const systemPrompt = `
You are MASTREY AI.

You generate original competitive-exam
practice questions for JEE MASTREY PRO.

ABSOLUTE RULES:

1. Generate ORIGINAL questions.
2. DO NOT generate PYQs.
3. DO NOT copy known examination questions.
4. DO NOT reproduce textbook questions word-for-word.
5. Use new values, scenarios and wording.
6. Never intentionally repeat questions.
7. Every question must be relevant to the requested topic.
8. Every question must have EXACTLY FOUR options.
9. There must be EXACTLY ONE correct answer.
10. The answer index must be 0, 1, 2 or 3.
11. Provide a detailed explanation.
12. Provide the underlying concept.
13. Avoid ambiguous questions.
14. Avoid multiple correct answers.
15. Avoid impossible questions.
16. Respect the requested difficulty.
17. Return ONLY JSON.
18. No markdown.
19. No commentary outside JSON.
20. Never add Mathematics to NEET.
21. Never add Biology to JEE.
22. Never add unrelated subjects to CA.
23. Follow the requested chapter.
24. Follow the requested topic.

${examInstruction}

${subjectInstruction}

${chapterInstruction}

${topicInstruction}

DIFFICULTY:
${difficulty}

Create exactly ${questionCount} questions.
`;


    /* =====================================================
       USER PROMPT
    ===================================================== */

    const userPrompt = `
Generate a fresh AI practice test.

EXAM:
${exam.toUpperCase()}

SUBJECT:
${subject}

CHAPTER:
${chapter}

TOPIC:
${topic}

DIFFICULTY:
${difficulty}

NUMBER OF QUESTIONS:
${questionCount}

Every question must be different.

Return data matching this structure:

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
      "concept": "Concept name",
      "explanation": "Detailed step-by-step explanation"
    }
  ]
}

ANSWER INDEX:

A = 0
B = 1
C = 2
D = 3

The answer field MUST contain only
0, 1, 2 or 3.
`;


    /* =====================================================
       OPENAI RESPONSES API
    ===================================================== */

    try {

        const openAIResponse =
            await fetch(
                "https://api.openai.com/v1/responses",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${apiKey}`

                    },

                    body: JSON.stringify({

                        model: "gpt-5.6-mini",

                        input: [
                            {
                                role: "system",
                                content: [
                                    {
                                        type: "input_text",
                                        text:
                                            systemPrompt
                                    }
                                ]
                            },
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "input_text",
                                        text:
                                            userPrompt
                                    }
                                ]
                            }
                        ],

                        text: {

                            format: {

                                type: "json_schema",

                                name:
                                    "mock_test",

                                strict: true,

                                schema: {

                                    type: "object",

                                    additionalProperties: false,

                                    properties: {

                                        questions: {

                                            type: "array",

                                            items: {

                                                type: "object",

                                                additionalProperties:
                                                    false,

                                                properties: {

                                                    id: {
                                                        type:
                                                            "integer"
                                                    },

                                                    subject: {
                                                        type:
                                                            "string"
                                                    },

                                                    chapter: {
                                                        type:
                                                            "string"
                                                    },

                                                    topic: {
                                                        type:
                                                            "string"
                                                    },

                                                    difficulty: {
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
                                                            "integer",

                                                        minimum:
                                                            0,

                                                        maximum:
                                                            3
                                                    },

                                                    concept: {
                                                        type:
                                                            "string"
                                                    },

                                                    explanation: {
                                                        type:
                                                            "string"
                                                    }

                                                },

                                                required: [

                                                    "id",
                                                    "subject",
                                                    "chapter",
                                                    "topic",
                                                    "difficulty",
                                                    "question",
                                                    "options",
                                                    "answer",
                                                    "concept",
                                                    "explanation"

                                                ]

                                            }

                                        }

                                    },

                                    required: [
                                        "questions"
                                    ]

                                }

                            }

                        }

                    })

                }
            );


        /* =================================================
           OPENAI ERROR
        ================================================= */

        if (!openAIResponse.ok) {

            const errorText =
                await openAIResponse.text();

            console.error(
                "OPENAI API ERROR:",
                errorText
            );

            return res.status(
                openAIResponse.status >= 400 &&
                openAIResponse.status < 500
                    ? openAIResponse.status
                    : 500
            ).json({

                success: false,

                error:
                    "OpenAI request failed.",

                details:
                    process.env.NODE_ENV ===
                    "development"
                        ? errorText
                        : undefined

            });

        }


        /* =================================================
           READ RESPONSE
        ================================================= */

        const data =
            await openAIResponse.json();


        /* =================================================
           EXTRACT OUTPUT
        ================================================= */

        let content = null;


        if (
            typeof data.output_text ===
            "string"
        ) {

            content =
                data.output_text;
        }


        if (!content) {

            const output =
                Array.isArray(data.output)
                    ? data.output
                    : [];

            for (
                const item of output
            ) {

                if (
                    item &&
                    item.type ===
                        "message"
                ) {

                    const parts =
                        Array.isArray(
                            item.content
                        )
                            ? item.content
                            : [];

                    for (
                        const part of parts
                    ) {

                        if (
                            part &&
                            typeof part.text ===
                                "string"
                        ) {

                            content =
                                part.text;

                            break;
                        }
                    }
                }

                if (content) break;
            }
        }


        if (!content) {

            console.error(
                "EMPTY OPENAI OUTPUT:",
                JSON.stringify(data)
            );

            return res.status(500).json({

                success: false,

                error:
                    "The AI returned an empty response."
            });

        }


        /* =================================================
           PARSE JSON
        ================================================= */

        let parsed;

        try {

            parsed =
                JSON.parse(content);

        } catch (error) {

            console.error(
                "AI JSON PARSE ERROR:",
                content
            );

            return res.status(500).json({

                success: false,

                error:
                    "The AI returned invalid question data."
            });
        }


        /* =================================================
           VALIDATE QUESTIONS
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
                    "AI response does not contain questions."
            });
        }


        const validQuestions = [];


        for (
            const question
            of parsed.questions
        ) {

            if (
                !question ||
                typeof question !==
                    "object"
            ) {
                continue;
            }


            if (
                typeof question.question !==
                    "string" ||
                !question.question.trim()
            ) {
                continue;
            }


            if (
                !Array.isArray(
                    question.options
                ) ||
                question.options.length !==
                    4
            ) {
                continue;
            }


            if (
                question.options.some(
                    option =>
                        typeof option !==
                        "string"
                )
            ) {
                continue;
            }


            const answer =
                Number(
                    question.answer
                );


            if (
                !Number.isInteger(answer) ||
                answer < 0 ||
                answer > 3
            ) {
                continue;
            }


            if (
                !subjects[exam]
                    .includes(
                        question.subject
                    )
            ) {
                continue;
            }


            if (
                subject !== "all" &&
                question.subject !==
                    subject
            ) {
                continue;
            }


            if (
                typeof question.explanation !==
                    "string" ||
                !question.explanation.trim()
            ) {
                continue;
            }


            validQuestions.push({

                id:
                    validQuestions.length + 1,

                subject:
                    question.subject,

                chapter:
                    question.chapter ||
                    chapter,

                topic:
                    question.topic ||
                    topic,

                difficulty:
                    question.difficulty ||
                    difficulty,

                question:
                    question.question.trim(),

                options:
                    question.options.map(
                        option =>
                            option.trim()
                    ),

                answer,

                concept:
                    question.concept ||
                    "Core concept",

                explanation:
                    question.explanation.trim()

            });

        }


        /* =================================================
           REMOVE DUPLICATES
        ================================================= */

        const seen =
            new Set();

        const uniqueQuestions =
            validQuestions.filter(
                question => {

                    const key =
                        question.question
                            .toLowerCase()
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .trim();

                    if (
                        seen.has(key)
                    ) {
                        return false;
                    }

                    seen.add(key);

                    return true;
                }
            );


        /* =================================================
           QUESTION COUNT CHECK
        ================================================= */

        if (
            uniqueQuestions.length === 0
        ) {

            return res.status(500).json({

                success: false,

                error:
                    "AI did not produce valid questions."
            });
        }


        /* =================================================
           RETURN
        ================================================= */

        return res.status(200).json({

            success: true,

            exam,

            subject,

            chapter,

            topic,

            difficulty,

            requestedQuestionCount:
                questionCount,

            generatedQuestionCount:
                uniqueQuestions.length,

            questions:
                uniqueQuestions

        });

    }


    /* =====================================================
       BACKEND ERROR
    ===================================================== */

    catch (error) {

        console.error(
            "BACKEND ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            error:
                "Unable to connect to the AI service."
        });
    }
}
