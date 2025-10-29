import { Hono } from "hono";
import { cors } from "hono/cors";
import { 
  CreateCategorySchema, 
  CreateQuestionSchema, 
  CreateExamSchema,
  SubmitExamSchema 
} from "@/shared/types";
import OpenAI from "openai";

interface Env {
  DB: D1Database;
  OPENAI_API_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Categories routes
app.get("/api/categories", async (c) => {
  const db = c.env.DB;
  const results = await db.prepare("SELECT * FROM categories ORDER BY created_at DESC").all();
  return c.json(results.results);
});

app.post("/api/categories", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const data = CreateCategorySchema.parse(body);
  
  const result = await db.prepare(
    "INSERT INTO categories (name, description, color) VALUES (?, ?, ?)"
  ).bind(data.name, data.description || null, data.color || null).run();
  
  return c.json({ id: result.meta.last_row_id });
});

app.delete("/api/categories/:id", async (c) => {
  const db = c.env.DB;
  const id = parseInt(c.req.param("id"));
  
  await db.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Questions routes
app.get("/api/questions", async (c) => {
  const db = c.env.DB;
  const categoryId = c.req.query("category_id");
  
  let query = "SELECT * FROM questions ORDER BY created_at DESC";
  let stmt = db.prepare(query);
  
  if (categoryId) {
    query = "SELECT * FROM questions WHERE category_id = ? ORDER BY created_at DESC";
    stmt = db.prepare(query).bind(parseInt(categoryId));
  }
  
  const results = await stmt.all();
  
  // Parse options from JSON string
  const questions = results.results.map((q: any) => ({
    ...q,
    options: JSON.parse(q.options)
  }));
  
  return c.json(questions);
});

app.post("/api/questions", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const data = CreateQuestionSchema.parse(body);
  
  const result = await db.prepare(
    "INSERT INTO questions (category_id, question, options, correct_answer, difficulty, explanation) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(
    data.category_id || null,
    data.question,
    JSON.stringify(data.options),
    data.correct_answer,
    data.difficulty,
    data.explanation || null
  ).run();
  
  return c.json({ id: result.meta.last_row_id });
});

app.delete("/api/questions/:id", async (c) => {
  const db = c.env.DB;
  const id = parseInt(c.req.param("id"));
  
  await db.prepare("DELETE FROM questions WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Exams routes
app.get("/api/exams", async (c) => {
  const db = c.env.DB;
  const results = await db.prepare(
    `SELECT e.*, c.name as category_name 
     FROM exams e 
     LEFT JOIN categories c ON e.category_id = c.id 
     WHERE e.is_active = 1 
     ORDER BY e.created_at DESC`
  ).all();
  
  return c.json(results.results);
});

app.post("/api/exams", async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const data = CreateExamSchema.parse(body);
  
  const result = await db.prepare(
    "INSERT INTO exams (title, description, category_id, duration_minutes, total_questions) VALUES (?, ?, ?, ?, ?)"
  ).bind(
    data.title,
    data.description || null,
    data.category_id || null,
    data.duration_minutes,
    data.total_questions
  ).run();
  
  return c.json({ id: result.meta.last_row_id });
});

app.get("/api/exams/:id", async (c) => {
  const db = c.env.DB;
  const id = parseInt(c.req.param("id"));
  
  const exam = await db.prepare("SELECT * FROM exams WHERE id = ? AND is_active = 1").bind(id).first();
  if (!exam) {
    return c.json({ error: "Exam not found" }, 404);
  }
  
  // Get random questions for this exam
  let questionsQuery = "SELECT * FROM questions ORDER BY RANDOM() LIMIT ?";
  let questionsStmt = db.prepare(questionsQuery).bind(exam.total_questions);
  
  if (exam.category_id) {
    questionsQuery = "SELECT * FROM questions WHERE category_id = ? ORDER BY RANDOM() LIMIT ?";
    questionsStmt = db.prepare(questionsQuery).bind(exam.category_id, exam.total_questions);
  }
  
  const questionsResult = await questionsStmt.all();
  const questions = questionsResult.results.map((q: any) => ({
    ...q,
    options: JSON.parse(q.options),
    correct_answer: undefined // Don't send correct answer to client
  }));
  
  return c.json({ exam, questions });
});

app.post("/api/exams/:id/submit", async (c) => {
  const db = c.env.DB;
  const examId = parseInt(c.req.param("id"));
  const body = await c.req.json();
  const data = SubmitExamSchema.parse(body);
  
  // Get exam questions to check answers
  const exam = await db.prepare("SELECT * FROM exams WHERE id = ?").bind(examId).first();
  if (!exam) {
    return c.json({ error: "Exam not found" }, 404);
  }
  
  // Calculate score
  let correctAnswers = 0;
  const totalQuestions = Object.keys(data.answers).length;
  
  for (const [questionId, userAnswer] of Object.entries(data.answers)) {
    const question = await db.prepare("SELECT correct_answer FROM questions WHERE id = ?")
      .bind(parseInt(questionId)).first();
    
    if (question && question.correct_answer === userAnswer) {
      correctAnswers++;
    }
  }
  
  const score = (correctAnswers / totalQuestions) * 100;
  
  const result = await db.prepare(
    "INSERT INTO exam_attempts (exam_id, score, total_questions, correct_answers, time_taken_minutes, answers) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(
    examId,
    score,
    totalQuestions,
    correctAnswers,
    data.time_taken_minutes,
    JSON.stringify(data.answers)
  ).run();
  
  return c.json({ 
    id: result.meta.last_row_id,
    score,
    correct_answers: correctAnswers,
    total_questions: totalQuestions
  });
});

// Progress routes
app.get("/api/progress", async (c) => {
  const db = c.env.DB;
  
  // Get overall stats
  const totalAttempts = await db.prepare("SELECT COUNT(*) as count FROM exam_attempts").first();
  const avgScore = await db.prepare("SELECT AVG(score) as avg FROM exam_attempts").first();
  
  // Get recent attempts
  const recentAttempts = await db.prepare(
    `SELECT ea.*, e.title as exam_title, c.name as category_name
     FROM exam_attempts ea
     JOIN exams e ON ea.exam_id = e.id
     LEFT JOIN categories c ON e.category_id = c.id
     ORDER BY ea.completed_at DESC
     LIMIT 10`
  ).all();
  
  // Get category performance
  const categoryStats = await db.prepare(
    `SELECT c.name, AVG(ea.score) as avg_score, COUNT(ea.id) as attempts
     FROM categories c
     LEFT JOIN exams e ON c.id = e.category_id
     LEFT JOIN exam_attempts ea ON e.id = ea.exam_id
     GROUP BY c.id, c.name
     ORDER BY avg_score DESC`
  ).all();
  
  return c.json({
    total_attempts: totalAttempts?.count || 0,
    average_score: avgScore?.avg || 0,
    recent_attempts: recentAttempts.results,
    category_stats: categoryStats.results
  });
});

// Smart question generation endpoint
app.post("/api/generate-questions", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File | null;
    const text = formData.get('text') as string | null;
    const numQuestions = parseInt(formData.get('num_questions') as string || '5');
    const language = formData.get('language') as string || 'ar';
    // const categoryId = formData.get('category_id') as string | null;

    if (!file && !text) {
      return c.json({ error: "No file or text provided" }, 400);
    }

    let content = '';

    if (file) {
      // Extract text from file
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);
      
      if (file.type === 'application/pdf') {
        // For PDF files, we'll use a simple text extraction
        // In a production app, you'd want to use a proper PDF parser
        const decoder = new TextDecoder();
        content = decoder.decode(uint8Array);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const decoder = new TextDecoder();
        content = decoder.decode(uint8Array);
      } else {
        return c.json({ error: "Unsupported file type" }, 400);
      }
    } else {
      content = text!;
    }

    // Truncate content if too long (OpenAI has token limits)
    if (content.length > 10000) {
      content = content.substring(0, 10000);
    }

    // Generate questions using OpenAI
    const openai = new OpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    });

    const systemPrompt = language === 'ar' 
      ? `أنت مساعد ذكي متخصص في إنشاء أسئلة اختبارات تعليمية عالية الجودة. مهمتك هي إنشاء أسئلة اختيار من متعدد باللغة العربية بناءً على النص المقدم.

متطلبات الأسئلة:
- كل سؤال يجب أن يحتوي على 4 خيارات (أ، ب، ج، د)
- يجب أن تكون الأسئلة واضحة ومحددة
- يجب أن تغطي النقاط المهمة في النص
- يجب أن تكون الخيارات منطقية ومعقولة
- يجب تنويع مستويات الصعوبة (سهل، متوسط، صعب)
- أضف تفسيراً مختصراً للإجابة الصحيحة

أجب بتنسيق JSON فقط كما يلي:`
      : `You are an intelligent assistant specialized in creating high-quality educational quiz questions. Your task is to generate multiple-choice questions in English based on the provided text.

Question requirements:
- Each question should have 4 options (A, B, C, D)
- Questions should be clear and specific
- Questions should cover important points in the text
- Options should be logical and reasonable
- Vary difficulty levels (easy, medium, hard)
- Add a brief explanation for the correct answer

Respond in JSON format only as follows:`;

    const prompt = `${systemPrompt}

{
  "questions": [
    {
      "question": "${language === 'ar' ? 'نص السؤال هنا' : 'Question text here'}",
      "options": ["${language === 'ar' ? 'الخيار الأول' : 'First option'}", "${language === 'ar' ? 'الخيار الثاني' : 'Second option'}", "${language === 'ar' ? 'الخيار الثالث' : 'Third option'}", "${language === 'ar' ? 'الخيار الرابع' : 'Fourth option'}"],
      "correct_answer": 0,
      "difficulty": "medium",
      "explanation": "${language === 'ar' ? 'تفسير الإجابة الصحيحة' : 'Explanation for correct answer'}"
    }
  ]
}

${language === 'ar' ? 'النص للتحليل:' : 'Text to analyze:'}
${content}

${language === 'ar' ? `أنشئ ${numQuestions} أسئلة بناءً على هذا النص.` : `Generate ${numQuestions} questions based on this text.`}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    if (!result.questions || !Array.isArray(result.questions)) {
      return c.json({ error: "Failed to generate questions" }, 500);
    }

    return c.json({ questions: result.questions });

  } catch (error) {
    console.error('Question generation error:', error);
    return c.json({ 
      error: "Failed to generate questions",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default app;
