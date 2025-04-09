
import { Mood, AssessmentQuestion, AssessmentResult } from "../types";

// Helper function to get dates for the past n days
const getDateDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Mock mood data for the past 14 days
export const mockMoods: Mood[] = [
  {
    id: "1",
    date: getDateDaysAgo(0),
    mood: "happy",
    notes: "Had a great day at work, accomplished a lot!",
    factors: {
      sleep: 8,
      stress: 3,
      exercise: 7,
      social: 6,
      nutrition: 8,
    },
  },
  {
    id: "2",
    date: getDateDaysAgo(1),
    mood: "neutral",
    notes: "Average day, nothing special",
    factors: {
      sleep: 7,
      stress: 5,
      exercise: 4,
      social: 5,
      nutrition: 6,
    },
  },
  {
    id: "3",
    date: getDateDaysAgo(2),
    mood: "sad",
    notes: "Had an argument with a friend",
    factors: {
      sleep: 6,
      stress: 8,
      exercise: 2,
      social: 3,
      nutrition: 4,
    },
  },
  {
    id: "4",
    date: getDateDaysAgo(3),
    mood: "very-happy",
    notes: "Got a promotion at work!",
    factors: {
      sleep: 9,
      stress: 2,
      exercise: 8,
      social: 9,
      nutrition: 7,
    },
  },
  {
    id: "5",
    date: getDateDaysAgo(4),
    mood: "neutral",
    notes: "Regular day",
    factors: {
      sleep: 7,
      stress: 5,
      exercise: 5,
      social: 4,
      nutrition: 6,
    },
  },
  {
    id: "6",
    date: getDateDaysAgo(5),
    mood: "happy",
    notes: "Spent time with family",
    factors: {
      sleep: 8,
      stress: 3,
      exercise: 6,
      social: 8,
      nutrition: 7,
    },
  },
  {
    id: "7",
    date: getDateDaysAgo(6),
    mood: "very-sad",
    notes: "Bad news from home",
    factors: {
      sleep: 4,
      stress: 9,
      exercise: 1,
      social: 2,
      nutrition: 3,
    },
  },
  {
    id: "8",
    date: getDateDaysAgo(7),
    mood: "sad",
    notes: "Feeling down for no particular reason",
    factors: {
      sleep: 5,
      stress: 7,
      exercise: 3,
      social: 4,
      nutrition: 5,
    },
  },
  {
    id: "9",
    date: getDateDaysAgo(8),
    mood: "neutral",
    notes: "Just an ordinary day",
    factors: {
      sleep: 6,
      stress: 5,
      exercise: 5,
      social: 5,
      nutrition: 6,
    },
  },
  {
    id: "10",
    date: getDateDaysAgo(9),
    mood: "happy",
    notes: "Met an old friend",
    factors: {
      sleep: 7,
      stress: 4,
      exercise: 6,
      social: 8,
      nutrition: 7,
    },
  },
  {
    id: "11",
    date: getDateDaysAgo(10),
    mood: "very-happy",
    notes: "Perfect day!",
    factors: {
      sleep: 9,
      stress: 1,
      exercise: 9,
      social: 9,
      nutrition: 9,
    },
  },
  {
    id: "12",
    date: getDateDaysAgo(11),
    mood: "neutral",
    notes: "Nothing special",
    factors: {
      sleep: 7,
      stress: 5,
      exercise: 4,
      social: 5,
      nutrition: 6,
    },
  },
  {
    id: "13",
    date: getDateDaysAgo(12),
    mood: "sad",
    notes: "Work stress",
    factors: {
      sleep: 5,
      stress: 8,
      exercise: 3,
      social: 4,
      nutrition: 5,
    },
  },
  {
    id: "14",
    date: getDateDaysAgo(13),
    mood: "happy",
    notes: "Good productive day",
    factors: {
      sleep: 8,
      stress: 4,
      exercise: 7,
      social: 6,
      nutrition: 7,
    },
  },
];

// Mock assessment questions for depression and anxiety
export const mockAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: "1",
    question: "Little interest or pleasure in doing things",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "depression",
  },
  {
    id: "2",
    question: "Feeling down, depressed, or hopeless",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "depression",
  },
  {
    id: "3",
    question: "Trouble falling or staying asleep, or sleeping too much",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "both",
  },
  {
    id: "4",
    question: "Feeling tired or having little energy",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "both",
  },
  {
    id: "5",
    question: "Poor appetite or overeating",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "depression",
  },
  {
    id: "6",
    question: "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "depression",
  },
  {
    id: "7",
    question: "Trouble concentrating on things, such as reading the newspaper or watching television",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "both",
  },
  {
    id: "8",
    question: "Feeling nervous, anxious, or on edge",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "anxiety",
  },
  {
    id: "9",
    question: "Not being able to stop or control worrying",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "anxiety",
  },
  {
    id: "10",
    question: "Worrying too much about different things",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "anxiety",
  },
  {
    id: "11",
    question: "Trouble relaxing",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "anxiety",
  },
  {
    id: "12",
    question: "Being so restless that it is hard to sit still",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "anxiety",
  },
  {
    id: "13",
    question: "Becoming easily annoyed or irritable",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "both",
  },
  {
    id: "14",
    question: "Feeling afraid as if something awful might happen",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
    factor: "anxiety",
  },
];

// Mock assessment results
export const mockAssessmentResults: AssessmentResult[] = [
  {
    date: getDateDaysAgo(14),
    depression: {
      score: 8,
      risk: "moderate",
      probability: 0.45,
    },
    anxiety: {
      score: 6,
      risk: "low",
      probability: 0.25,
    },
  },
  {
    date: getDateDaysAgo(7),
    depression: {
      score: 6,
      risk: "low",
      probability: 0.35,
    },
    anxiety: {
      score: 9,
      risk: "moderate",
      probability: 0.55,
    },
  },
  {
    date: getDateDaysAgo(0),
    depression: {
      score: 4,
      risk: "low",
      probability: 0.2,
    },
    anxiety: {
      score: 5,
      risk: "low",
      probability: 0.3,
    },
  },
];
