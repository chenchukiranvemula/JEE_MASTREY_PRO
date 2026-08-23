/* =========================================================
   JEE MASTREY PRO
   AI MOCK TEST BACKEND
   OPENROUTER FREE
   Vercel Serverless Function

   JEE + NEET + CA

   FEATURES
   ---------------------------------------------------------
   • Subject-wise tests
   • Chapter-wise tests
   • Topic-wise tests
   • Difficulty selection
   • Original AI questions
   • 4 options
   • One correct answer
   • Detailed solutions
   • JEE: Physics / Chemistry / Mathematics
   • NEET: Physics / Chemistry / Biology
   • CA: Accounting / Business Studies / Economics / Law
   • No PYQs
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

        return res
            .status(200)
            .end();

    }


    if (req.method !== "POST") {

        return res.status(405).json({

            success: false,

            error:
                "Only POST requests are allowed."

        });

    }



    /* =====================================================
       OPENROUTER API KEY
    ===================================================== */

    const apiKey =
        process.env.OPENROUTER_API_KEY;


    if (!apiKey) {

        return res.status(500).json({

            success: false,

            error:
                "OPENROUTER_API_KEY is not configured in Vercel."

        });

    }



    /* =====================================================
       READ REQUEST BODY
    ===================================================== */

    let body = {};


    try {

        body =
            typeof req.body === "string"

                ? JSON.parse(req.body)

                : (req.body || {});

    }

    catch (error) {

        return res.status(400).json({

            success: false,

            error:
                "Invalid request body."

        });

    }



    /* =====================================================
       INPUT VALUES
    ===================================================== */

    const exam =
        String(
            body.exam || "jee"
        )
        .trim()
        .toLowerCase();


    const subject =
        String(
            body.subject || "all"
        )
        .trim();


    const chapter =
        String(
            body.chapter || "all"
        )
        .trim();


    const topic =
        String(
            body.topic || "all"
        )
        .trim();


    const difficulty =
        String(
            body.difficulty || "mixed"
        )
        .trim()
        .toLowerCase();


    const questionCount =
        Math.min(

            Math.max(

                Number(
                    body.questionCount
                ) || 5,

                1

            ),

            30

        );



    /* =====================================================
       SUBJECT DATABASE
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
                "Invalid examination."

        });

    }



    /* =====================================================
       VALIDATE SUBJECT
    ===================================================== */

    if (

        subject !== "all" &&

        !subjects[exam]
            .includes(subject)

    ) {

        return res.status(400).json({

            success: false,

            error:
                `${subject} is not available for ${exam.toUpperCase()}.`

        });

    }



    /* =====================================================
       NEET MATHEMATICS PROTECTION
    ===================================================== */

    if (

        exam === "neet" &&

        subject.toLowerCase() ===
            "mathematics"

    ) {

        return res.status(400).json({

            success: false,

            error:
                "NEET uses Biology instead of Mathematics."

        });

    }



    /* =====================================================
       EXAM INSTRUCTIONS
    ===================================================== */

    let examInstruction = "";


    if (exam === "jee") {

        examInstruction = `

EXAMINATION: JEE

SUBJECTS:

Physics
Chemistry
Mathematics

Generate questions appropriate for
JEE Main / JEE Advanced preparation.

Use:

• conceptual questions
• numerical questions
• application questions
• multi-step reasoning where appropriate

Do not generate questions outside the
selected syllabus/topic.

`;

    }



    if (exam === "neet") {

        examInstruction = `

EXAMINATION: NEET

SUBJECTS:

Physics
Chemistry
Biology

VERY IMPORTANT:

NEET DOES NOT HAVE MATHEMATICS.

Biology MUST replace Mathematics.

Biology questions may cover:

• Botany
• Zoology
• Cell Biology
• Genetics
• Human Physiology
• Plant Physiology
• Ecology
• Reproduction
• Biotechnology
• Evolution
• Animal Biology

Never generate Mathematics for NEET.

`;

    }



    if (exam === "ca") {

        examInstruction = `

EXAMINATION: CA

SUBJECTS:

Accounting
Business Studies
Economics
Law

Generate questions suitable for CA preparation.

Use:

• conceptual questions
• numerical/application questions
• case-based questions
• reasoning questions
• legal application questions

when appropriate.

`;

    }



    /* =====================================================
       SUBJECT INSTRUCTION
    ===================================================== */

    const subjectInstruction =

        subject === "all"

            ? `

Generate questions across these subjects:

${subjects[exam].join(", ")}

`

            : `

Generate questions ONLY from:

${subject}

`;



    /* =====================================================
       CHAPTER INSTRUCTION
    ===================================================== */

    const chapterInstruction =

        chapter === "all"

            ? `

Choose an appropriate chapter
from the selected subject.

`

            : `

Generate questions ONLY from:

Chapter:
${chapter}

`;



    /* =====================================================
       TOPIC INSTRUCTION
    ===================================================== */

    const topicInstruction =

        topic === "all"

            ? `

Choose appropriate topics
from the selected chapter.

`

            : `

Generate questions ONLY from:

Topic:
${topic}

`;



    /* =====================================================
       SYSTEM PROMPT
    ===================================================== */

    const systemPrompt = `

You are MASTREY AI.

You are the AI question-generation engine
inside JEE MASTREY PRO.

Your task is to create ORIGINAL
competitive examination practice questions.

=========================================================
ABSOLUTE RULES
=========================================================

1. NEVER generate PYQs.

2. NEVER copy previous examination questions.

3. NEVER reproduce textbook questions
   word-for-word.

4. Create fresh questions.

5. Use new numerical values,
   scenarios and wording.

6. Never intentionally repeat a question.

7. Every question must belong to
   the selected examination.

8. Every question must belong to
   the selected subject.

9. Respect the selected chapter.

10. Respect the selected topic.

11. Every question must contain
    EXACTLY FOUR options.

12. Exactly ONE option must be correct.

13. The answer must be represented
    by a zero-based number.

A = 0
B = 1
C = 2
D = 3

14. Provide the tested concept.

15. Provide a detailed solution.

16. Avoid ambiguous questions.

17. Avoid multiple correct answers.

18. Avoid impossible questions.

19. Follow the requested difficulty.

20. Return ONLY valid JSON.

21. Do not use Markdown.

22. Do not put text before the JSON.

23. Do not put text after the JSON.

=========================================================

${examInstruction}

${subjectInstruction}

${chapterInstruction}

${topicInstruction}

Difficulty:

${difficulty}

=========================================================

Generate exactly:

${questionCount}

questions.

`;



    /* =====================================================
       USER PROMPT
    ===================================================== */

    const userPrompt = `

Create a completely fresh
${exam.toUpperCase()} mock test.

Exam:
${exam.toUpperCase()}

Subject:
${subject}

Chapter:
${chapter}

Topic:
${topic}

Difficulty:
${difficulty}

Number of questions:
${questionCount}

Every question must be unique.

Return EXACTLY this JSON structure:

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

Remember:

A = 0
B = 1
C = 2
D = 3

Return JSON only.

`;



    /* =====================================================
       OPENROUTER REQUEST
    ===================================================== */

    try {

        const response =

            await fetch(

                "https://openrouter.ai/api/v1/chat/completions",

                {

                    method:
                        "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${apiKey}`,

                        "Content-Type":
                            "application/json",

                        "HTTP-Referer":
                            "https://chenchukiranvemula.github.io/JEE_MASTREY_PRO/",

                        "X-Title":
                            "JEE MASTREY PRO"

                    },

                    body:

                        JSON.stringify({

                            model:
                                "openai/gpt-oss-20b:free",

                            temperature:
                                0.8,

                            max_tokens:
                                12000,

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

                            ],

                            response_format: {

                                type:
                                    "json_object"

                            }

                        })

                }

            );



        /* =================================================
           OPENROUTER ERROR
        ================================================= */

        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "OPENROUTER API ERROR:",
                errorText
            );


            return res.status(500).json({

                success: false,

                error:
                    "OpenRouter request failed.",

                details:
                    errorText

            });

        }



        /* =================================================
           RESPONSE JSON
        ================================================= */

        const data =
            await response.json();



        /* =================================================
           EXTRACT AI CONTENT
        ================================================= */

        const content =

            data
                ?.choices
                ?.[0]
                ?.message
                ?.content;



        if (!content) {

            console.error(
                "EMPTY OPENROUTER RESPONSE:",
                JSON.stringify(data)
            );


            return res.status(500).json({

                success: false,

                error:
                    "OpenRouter returned an empty response."

            });

        }



        /* =================================================
           CLEAN RESPONSE
        ================================================= */

        let cleanContent =
            String(content)
                .trim();


        /*
           Some free models may still surround JSON
           with Markdown fences.
        */

        if (
            cleanContent
                .startsWith("```")
        ) {

            cleanContent =
                cleanContent
                    .replace(
                        /^```(?:json)?/i,
                        ""
                    )
                    .replace(
                        /```$/i,
                        ""
                    )
                    .trim();

        }



        /* =================================================
           PARSE JSON
        ================================================= */

        let parsed;


        try {

            parsed =
                JSON.parse(
                    cleanContent
                );

        }

        catch (error) {

            console.error(
                "INVALID AI JSON:",
                cleanContent
            );


            return res.status(500).json({

                success: false,

                error:
                    "OpenRouter returned invalid question data.",

                raw:
                    cleanContent
                        .substring(
                            0,
                            1500
                        )

            });

        }



        /* =================================================
           QUESTIONS CHECK
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



        /* =================================================
           VALIDATE QUESTIONS
        ================================================= */

        const questions = [];

        const seen =
            new Set();



        for (
            const q of parsed.questions
        ) {


            /* ---------------------------------------------
               OBJECT
            --------------------------------------------- */

            if (

                !q ||

                typeof q !== "object"

            ) {

                continue;

            }



            /* ---------------------------------------------
               QUESTION TEXT
            --------------------------------------------- */

            if (

                typeof q.question !==
                "string"

            ) {

                continue;

            }



            /* ---------------------------------------------
               OPTIONS
            --------------------------------------------- */

            if (

                !Array.isArray(
                    q.options
                )

            ) {

                continue;

            }



            if (
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



            /* ---------------------------------------------
               ANSWER
            --------------------------------------------- */

            const answer =
                Number(q.answer);



            if (

                !Number.isInteger(
                    answer
                ) ||

                answer < 0 ||

                answer > 3

            ) {

                continue;

            }



            /* ---------------------------------------------
               SUBJECT
            --------------------------------------------- */

            if (

                !subjects[exam]
                    .includes(
                        q.subject
                    )

            ) {

                continue;

            }



            /* ---------------------------------------------
               SELECTED SUBJECT
            --------------------------------------------- */

            if (

                subject !== "all" &&

                q.subject !== subject

            ) {

                continue;

            }



            /* ---------------------------------------------
               TEXT
            --------------------------------------------- */

            const questionText =

                q.question
                    .trim();



            if (
                questionText.length < 5
            ) {

                continue;

            }



            /* ---------------------------------------------
               DUPLICATE PROTECTION
            --------------------------------------------- */

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



            /* ---------------------------------------------
               SAVE QUESTION
            --------------------------------------------- */

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

                answer:
                    answer,

                concept:
                    q.concept ||
                    "Core concept",

                explanation:
                    q.explanation ||
                    "Detailed solution unavailable."

            });

        }



        /* =================================================
           NO VALID QUESTIONS
        ================================================= */

        if (
            questions.length === 0
        ) {

            return res.status(500).json({

                success: false,

                error:
                    "OpenRouter generated no valid questions."

            });

        }



        /* =================================================
           SUCCESS
        ================================================= */

        return res.status(200).json({

            success:
                true,

            provider:
                "openrouter",

            model:
                "openai/gpt-oss-20b:free",

            exam:
                exam,

            subject:
                subject,

            chapter:
                chapter,

            topic:
                topic,

            difficulty:
                difficulty,

            questionCount:
                questions.length,

            questions:
                questions

        });


    }


    /* =====================================================
       BACKEND ERROR
    ===================================================== */

    catch (error) {

        console.error(
            "OPENROUTER BACKEND ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                "Unable to connect to OpenRouter.",

            details:
                error.message

        });

    }

           }
