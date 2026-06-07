import type { Exam, Question, Subject, SubjectResult } from "@/types/exam";

export const subjects: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    description: "Algebra, calculus, geometry, and quantitative reasoning.",
    questionCount: 420,
    estimatedHours: 36,
  },
  {
    id: "physics",
    name: "Physics",
    description: "Mechanics, electricity, waves, and modern physics.",
    questionCount: 360,
    estimatedHours: 30,
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Organic, inorganic, physical chemistry, and lab concepts.",
    questionCount: 340,
    estimatedHours: 28,
  },
  {
    id: "biology",
    name: "Biology",
    description: "Cell biology, genetics, ecology, physiology, and evolution.",
    questionCount: 390,
    estimatedHours: 32,
  },
  {
    id: "english",
    name: "English",
    description: "Reading comprehension, grammar, vocabulary, and writing.",
    questionCount: 280,
    estimatedHours: 22,
  },
  {
    id: "civics",
    name: "Civics",
    description: "Citizenship, governance, ethics, and constitutional literacy.",
    questionCount: 220,
    estimatedHours: 18,
  },
];

export const exams: Exam[] = [
  {
    id: "demo-2015",
    title: "Grade 12 National Entrance Mock 2015",
    subject: "Natural Science",
    grade: 12,
    year: 2015,
    difficulty: "Medium",
    durationMinutes: 120,
    questionCount: 60,
    completionRate: 68,
  },
  {
    id: "math-2016",
    title: "Mathematics Entrance Practice 2016",
    subject: "Mathematics",
    grade: 12,
    year: 2016,
    difficulty: "Hard",
    durationMinutes: 90,
    questionCount: 45,
    completionRate: 54,
  },
  {
    id: "biology-2014",
    title: "Biology University Entrance 2014",
    subject: "Biology",
    grade: 12,
    year: 2014,
    difficulty: "Medium",
    durationMinutes: 75,
    questionCount: 50,
    completionRate: 73,
  },
  {
    id: "english-2017",
    title: "English Reading and Grammar Drill",
    subject: "English",
    grade: 12,
    year: 2017,
    difficulty: "Easy",
    durationMinutes: 60,
    questionCount: 40,
    completionRate: 81,
  },
];

const baseQuestions: Question[] = [
  {
    id: "q1",
    number: 1,
    subject: "Mathematics",
    difficulty: "Medium",
    prompt:
      "If f(x) = 2x^2 - 3x + 1, what is the value of f(3) - f(1)?",
    options: [
      { id: "a", label: "A", value: "8" },
      { id: "b", label: "B", value: "10" },
      { id: "c", label: "C", value: "12" },
      { id: "d", label: "D", value: "14" },
    ],
    answerId: "b",
    explanation:
      "Evaluate f(3)=18-9+1=10 and f(1)=2-3+1=0, so the difference is 10.",
  },
  {
    id: "q2",
    number: 2,
    subject: "Physics",
    difficulty: "Hard",
    prompt:
      "A body starts from rest and accelerates uniformly at 4 m/s² for 5 seconds. What distance does it travel?",
    options: [
      { id: "a", label: "A", value: "25 m" },
      { id: "b", label: "B", value: "40 m" },
      { id: "c", label: "C", value: "50 m" },
      { id: "d", label: "D", value: "80 m" },
    ],
    answerId: "c",
    explanation:
      "Use s = ut + 1/2 at². With u=0, a=4, t=5, the distance is 50 m.",
  },
  {
    id: "q3",
    number: 3,
    subject: "Chemistry",
    difficulty: "Medium",
    prompt:
      "Which intermolecular force is primarily responsible for the unusually high boiling point of water?",
    options: [
      { id: "a", label: "A", value: "London dispersion forces" },
      { id: "b", label: "B", value: "Hydrogen bonding" },
      { id: "c", label: "C", value: "Ionic bonding" },
      { id: "d", label: "D", value: "Metallic bonding" },
    ],
    answerId: "b",
    explanation:
      "Water molecules form hydrogen bonds, which require more energy to overcome.",
  },
  {
    id: "q4",
    number: 4,
    subject: "Biology",
    difficulty: "Easy",
    prompt:
      "Which organelle is the main site of cellular respiration in eukaryotic cells?",
    options: [
      { id: "a", label: "A", value: "Ribosome" },
      { id: "b", label: "B", value: "Mitochondrion" },
      { id: "c", label: "C", value: "Nucleus" },
      { id: "d", label: "D", value: "Golgi apparatus" },
    ],
    answerId: "b",
    explanation:
      "Mitochondria produce ATP through aerobic cellular respiration.",
  },
  {
    id: "q5",
    number: 5,
    subject: "English",
    difficulty: "Medium",
    prompt:
      "Choose the sentence that is grammatically correct.",
    options: [
      { id: "a", label: "A", value: "Neither the students nor the teacher were late." },
      { id: "b", label: "B", value: "Neither the students nor the teacher was late." },
      { id: "c", label: "C", value: "Neither the students or the teacher was late." },
      { id: "d", label: "D", value: "Neither the students nor the teacher are late." },
    ],
    answerId: "b",
    explanation:
      "With paired subjects joined by neither/nor, the verb agrees with the nearer subject.",
  },
];

export const questions: Question[] = Array.from({ length: 30 }, (_, index) => {
  const source = baseQuestions[index % baseQuestions.length];
  return {
    ...source,
    id: `q${index + 1}`,
    number: index + 1,
  };
});

export const results: SubjectResult[] = [
  { subject: "Mathematics", score: 34, total: 45, trend: "up" },
  { subject: "Physics", score: 28, total: 40, trend: "steady" },
  { subject: "Chemistry", score: 31, total: 40, trend: "up" },
  { subject: "Biology", score: 36, total: 45, trend: "up" },
  { subject: "English", score: 22, total: 30, trend: "down" },
];
