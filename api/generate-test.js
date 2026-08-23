/* =========================================================
   JEE MASTREY PRO
   AI MOCK TEST BACKEND
   Vercel Serverless Function
   JEE + NEET + CA
========================================================= */

export default async function handler(req, res) {

    /* -----------------------------------------------------
       CORS
    ----------------------------------------------------- */

    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://chenchukiranvemula.github.io"
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


    /* -----------------------------------------------------
       API KEY
    ----------------------------------------------------- */

    const apiKey =
        process.env.OPENAI_API_KEY;

    if (!apiKey) {

        return res.status(500).json({
            success: false,
            error:
                "OPENAI_API_KEY is not configured on Vercel."
        });

    }


    /* -----------------------------------------------------
       REQUEST DATA
    ----------------------------------------------------- */

    const body =
        typeof req.body === "string"
            ? JSON.parse(req.body)
            : req.body || {};


    const exam =
        String(body.exam || "jee")
            .toLowerCase();

    const subject =
        String(body.subject || "all");

    const difficulty =
        String(body.difficulty || "mixed");

    const questionCount =
        Math.min(
            Math.max(
                Number(body.questionCount) || 20,
                1
            ),
            50
        );


    /* -----------------------------------------------------
       VALIDATE EXAM
    ----------------------------------------------------- */

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


    if (!subjects[exam]) {

        return res.status(400).json({
            success: false,
            error: "Invalid examination."
        });

    }


    if (
        subject !== "all" &&
        !subjects[exam].includes(subject)
    ) {

        return res.status(400).json({
            success: false,
            error:
                "Selected subject does not belong to this examination."
        });

    }


    /* -----------------------------------------------------
       SUBJECT INSTRUCTION
    ----------------------------------------------------- */

    let subjectInstruction = "";

    if (subject === "all") {

        subjectInstruction =
            `Distribute questions across these subjects:
${subjects[exam].join(", ")}.`;

    }
    else {

        subjectInstruction =
            `Generate questions ONLY from:
${subject}.`;

    }


    /* -----------------------------------------------------
       EXAM RULES
    ----------------------------------------------------- */

    let examInstruction = "";


    if (exam === "jee") {

        examInstruction = `
EXAMINATION: JEE

Subjects:
- Physics
- Chemistry
- Mathematics

Generate questions appropriate for JEE Main/Advanced preparation.

Use proper numerical, conceptual and application-based questions.
Avoid questions that require information outside the selected syllabus.
`;

    }


    if (exam === "neet") {

        examInstruction = `
EXAMINATION: NEET

Subjects:
- Physics
- Chemistry
- Biology

IMPORTANT:
NEET MUST USE BIOLOGY, NOT MATHEMATICS.

For Biology use appropriate NCERT-oriented
Botany and Zoology concepts.

Generate NEET-style conceptual and application questions.
`;

    }


    if (exam === "ca") {

        examInstruction = `
EXAMINATION: CA

Subjects:
- Accounting
- Business Studies
- Economics
- Law

Generate questions suitable for CA preparation.

Use accounting concepts, business concepts,
economics concepts and legal concepts as appropriate.
`;

    }


    /* -----------------------------------------------------
       PROMPT
    ----------------------------------------------------- */

    const systemPrompt = `

You are MASTREY AI, an expert competitive-exam
question generator for the JEE MASTREY PRO application.

Your job is to generate ORIGINAL questions.

VERY IMPORTANT RULES:

1. NEVER generate PYQs.
2. NEVER copy questions from previous examinations.
3. NEVER reproduce known textbook questions word-for-word.
4. Generate fresh questions using new values,
   new scenarios and new wording.
5. Do not repeat the same question inside one test.
6. Keep every question relevant to the selected examination.
7. Each question must have exactly FOUR options.
8. Exactly ONE option must be correct.
9. Give a clear explanation.
10. Give the underlying concept.
11. Do not include markdown.
12. Return ONLY valid JSON.
13. Do not add text before or after the JSON.
14. For NEET, Biology replaces Mathematics completely.
15. For CA, use Accounting, Business Studies,
    Economics and Law.
16. Avoid ambiguous questions.
17. Avoid multiple correct answers.
18. Avoid impossible or trick questions unless
    the requested difficulty is hard.
19. Questions must be educationally useful.

${examInstruction}

DIFFICULTY:
${difficulty}

${subjectInstruction}

Create exactly ${questionCount} questions.
`;


    const userPrompt = `

Create a completely fresh ${exam.toUpperCase()} mock test.

Difficulty:
${difficulty}

Subject:
${subject}

Number of questions:
${questionCount}

Every question must be unique within this test.

Return exactly this JSON structure:

{
  "questions": [
    {
      "id": 1,
      "subject": "Physics",
      "chapter": "Chapter name",
      "difficulty": "medium",
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": 0,
      "concept": "Concept being tested",
      "explanation": "Detailed step-by-step explanation"
    }
  ]
}

IMPORTANT:

"answer" must be the ZERO-BASED option index.

A = 0
B = 1
C = 2
D = 3

Do not use A/B/C/D in the answer field.
Use only 0, 1, 2 or 3.

Return JSON only.
`;


    /* -----------------------------------------------------
       OPENAI REQUEST
    ----------------------------------------------------- */

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
                            0.9,

                        response_format: {
                            type: "json_object"
                        },

                        messages: [

                            {
                                role: "system",
                                content:
                                    systemPrompt
                            },

                            {
                                role: "user",
                                content:
                                    userPrompt
                            }

                        ]

                    })

                }
            );


        /* -------------------------------------------------
           OPENAI ERROR
        ------------------------------------------------- */

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "OpenAI error:",
                errorText
            );

            return res.status(500).json({

                success: false,

                error:
                    "AI generation failed. Check the OpenAI API configuration."

            });

        }


        const data =
            await response.json();


        /* -------------------------------------------------
           EXTRACT AI RESPONSE
        ------------------------------------------------- */

        const content =
            data?.choices?.[0]?.message?.content;


        if (!content) {

            return res.status(500).json({

                success: false,

                error:
                    "The AI returned an empty response."

            });

        }


        /* -------------------------------------------------
           PARSE JSON
        ------------------------------------------------- */

        let parsed;

        try {

            parsed =
                JSON.parse(content);

        }
        catch (error) {

            console.error(
                "Invalid AI JSON:",
                content
            );

            return res.status(500).json({

                success: false,

                error:
                    "The AI returned invalid question data."

            });

        }


        /* -------------------------------------------------
           VALIDATE QUESTIONS
        ------------------------------------------------- */

        if (
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


        const validQuestions =
            parsed.questions
                .filter(question => {

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
                        question.options.length !==
                        4
                    ) {
                        return false;
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
                        return false;
                    }

                    if (
                        !subjects[exam]
                            .includes(
                                question.subject
                            )
                    ) {
                        return false;
                    }

                    if (
                        subject !== "all" &&
                        question.subject !==
                            subject
                    ) {
                        return false;
                    }

                    return true;

                });


        /* -------------------------------------------------
           REMOVE DUPLICATES
        ------------------------------------------------- */

        const seen =
            new Set();

        const uniqueQuestions =
            validQuestions.filter(
                question => {

                    const key =
                        question.question
                            .trim()
                            .toLowerCase();

                    if (
                        seen.has(key)
                    ) {
                        return false;
                    }

                    seen.add(key);

                    return true;

                }
            );


        if (
            uniqueQuestions.length === 0
        ) {

            return res.status(500).json({

                success: false,

                error:
                    "No valid questions were generated."

            });

        }


        /* -------------------------------------------------
           RETURN TEST
        ------------------------------------------------- */

        return res.status(200).json({

            success: true,

            exam,

            subject,

            difficulty,

            questions:
                uniqueQuestions

        });


    }
    catch (error) {

        console.error(
            "Backend error:",
            error
        );

        return res.status(500).json({

            success: false,

            error:
                "Unable to connect to the AI service."

        });

    }

}
