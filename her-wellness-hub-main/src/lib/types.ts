export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  allergies: string;
  medicalConditions: string[];
  lastPeriodDate: string;
  cycleLength: number;
  profileComplete: boolean;
}

export interface HealthData {
  id: string;
  userId: string;
  sleepHours: number;
  stepsWalked: number;
  waterIntake: number;
  stressLevel: number;
  dietQuality: number;
  healthScore: number;
  date: string;
}

export interface PeriodData {
  userId: string;
  lastPeriodDate: string;
  cycleLength: number;
  predictedNextPeriod: string;
  ovulationWindow: { start: string; end: string };
}

export interface DietPlan {
  userId: string;
  date: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
  ironFoods: string[];
  proteinFoods: string[];
  groceryList: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const MEDICAL_CONDITIONS = [
  'PCOS', 'PMS', 'Dysmenorrhea', 'Endometriosis', 'Uterine Fibroids',
  'Pelvic Inflammatory Disease', 'Infertility', 'Ovarian Cysts',
  'Gestational Diabetes', 'Preeclampsia', 'Postpartum Depression',
  'Urinary Tract Infection', 'Yeast Infection', 'HPV Infection',
  'Breast Cancer', 'Cervical Cancer', 'Ovarian Cancer',
  'Anemia', 'Osteoporosis', 'Thyroid Disease', 'Menopause'
] as const;
