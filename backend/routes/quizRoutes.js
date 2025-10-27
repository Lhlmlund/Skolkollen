// backend/routes/quizRoutes.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/quiz/questions
 * Hämtar frågor (i ordning) + svarsalternativ.
 * Fält följer ditt schema: order_index, program_hint, weight.
 */
router.get("/questions", async (_req, res) => {
  try {
    const questions = await prisma.quizQuestion.findMany({
      orderBy: { order_index: "asc" },
      include: {
        options: {
          orderBy: { id: "asc" },
          select: { id: true, label: true, program_hint: true, weight: true },
        },
      },
    });
    res.json(questions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    res.status(500).json({ error: "Error fetching quiz questions" });
  }
});

/**
 * POST /api/quiz/submit
 * Body: { answers: [{ questionId:number, optionId:number }, ...] }
 * - Skapar QuizSubmission (uuid autogenereras)
 * - Sparar answers i submission_answer
 * - Räknar poäng per program_hint (sum(weight))
 * - Försöker hitta Program via:
 *    1) category === hint  ELLER  name CONTAINS hint (utan mode)
 *    2) fallback-karta (t.ex. "Teknik" -> "Teknikprogrammet")
 * - Sätter suggested_program_id om träff
 */
router.post("/submit", async (req, res) => {
  try {
    const { answers } = req.body || {};
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "answers (array) krävs" });
    }

    // Validera/normalisera inkommande
    const cleaned = answers
      .map((a) => ({
        questionId: Number(a?.questionId),
        optionId: Number(a?.optionId),
      }))
      .filter((a) => Number.isFinite(a.questionId) && Number.isFinite(a.optionId));

    if (cleaned.length !== answers.length) {
      return res.status(400).json({ error: "Ogiltiga answers" });
    }

    // Hämta alla valda options för att läsa hint/weight
    const optionIds = cleaned.map((a) => a.optionId);
    const options = await prisma.quizOption.findMany({
      where: { id: { in: optionIds } },
      select: { id: true, program_hint: true, weight: true },
    });
    if (options.length !== optionIds.length) {
      return res.status(400).json({ error: "Minst ett optionId saknas i databasen" });
    }

    // Summera poäng per hint
    const score = new Map(); // hint -> sumWeight
    for (const opt of options) {
      if (!opt.program_hint) continue;
      const w = opt.weight ?? 1;
      const key = String(opt.program_hint).trim();
      if (!key) continue;
      score.set(key, (score.get(key) || 0) + w);
    }

    // Välj bästa hint
    let bestHint = null;
    let bestScore = -Infinity;
    for (const [hint, s] of score.entries()) {
      if (s > bestScore) {
        bestScore = s;
        bestHint = hint;
      }
    }

    // Skapa submission (uuid autogenereras)
    const submission = await prisma.quizSubmission.create({ data: {} });

    // Spara svar (snake_case enligt ditt schema)
    for (const a of cleaned) {
      await prisma.submissionAnswer.create({
        data: {
          submission_id: submission.id,
          question_id: a.questionId,
          option_id: a.optionId,
        },
      });
    }

    // Försök hitta program för rekommendation
    let suggestedProgram = null;

    if (bestHint) {
      const q = String(bestHint).trim();

      // 1) category === hint ELLER name CONTAINS hint
      //    (utan mode, för kompatibilitet – MySQL brukar vara case-insensitive vid *_ci)
      suggestedProgram = await prisma.program.findFirst({
        where: {
          OR: [
            { category: q },
            { name: { contains: q } },
          ],
        },
        select: { id: true, name: true, category: true },
      });

      // 2) Fallback-karta om inget hittades
      if (!suggestedProgram) {
        const nameMap = {
          Teknik: "Teknikprogrammet",
          Naturvetenskap: "Naturvetenskapsprogrammet",
          Ekonomi: "Ekonomiprogrammet",
          Estetik: "Estetiska programmet",
          Vård: "Vård- och omsorgsprogrammet",
        };
        const targetName = nameMap[q];
        if (targetName) {
          suggestedProgram = await prisma.program.findFirst({
            where: { name: { contains: targetName } },
            select: { id: true, name: true, category: true },
          });
        }
      }
    }

    // Sätt suggested_program_id om vi har en träff
    if (suggestedProgram) {
      await prisma.quizSubmission.update({
        where: { id: submission.id },
        data: { suggested_program_id: suggestedProgram.id },
      });
    }

    return res.status(201).json({
      submissionId: submission.id,
      suggestedProgram: suggestedProgram || null,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Error submitting quiz" });
  }
});

export default router;
