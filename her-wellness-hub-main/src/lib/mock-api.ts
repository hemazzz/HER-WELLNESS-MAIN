/**
 * Mock API service layer — simulates backend REST API calls.
 * Replace these with actual fetch() calls to your Node.js/Express backend.
 * 
 * Backend routes this maps to:
 * POST /api/auth/signup
 * POST /api/auth/login
 * POST /api/auth/verify-otp
 * POST /api/auth/forgot-password
 * GET/PUT /api/profile
 * GET/POST /api/health-data
 * POST /api/chatbot
 * GET /api/diet-plan
 * GET/POST /api/period
 */

import { User, HealthData, DietPlan } from './types';
import { addDays, format } from 'date-fns';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// Auth
export const api = {
  async signup(email: string, _password: string) {
    await delay(800);
    localStorage.setItem('pending_email', email);
    return { success: true, message: 'OTP sent to your email' };
  },

  async verifyOtp(email: string, otp: string) {
    await delay(600);
    if (otp.length === 6) {
      const user: User = {
        id: crypto.randomUUID(),
        name: '', email, age: 0, height: 0, weight: 0,
        allergies: '', medicalConditions: [], lastPeriodDate: '',
        cycleLength: 28, profileComplete: false,
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-jwt-token');
      return { success: true, user };
    }
    throw new Error('Invalid OTP');
  },

  async login(email: string, _password: string) {
    await delay(800);
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.email === email) {
        localStorage.setItem('token', 'mock-jwt-token');
        return { success: true, user };
      }
    }
    // For demo, create user on login too
    const user: User = {
      id: crypto.randomUUID(), name: 'Demo User', email,
      age: 28, height: 165, weight: 60, allergies: 'None',
      medicalConditions: ['PMS'], lastPeriodDate: format(addDays(new Date(), -14), 'yyyy-MM-dd'),
      cycleLength: 28, profileComplete: true,
    };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'mock-jwt-token');
    return { success: true, user };
  },

  async forgotPassword(email: string) {
    await delay(600);
    localStorage.setItem('pending_email', email);
    return { success: true, message: 'OTP sent for password reset' };
  },

  async resetPassword(_email: string, _otp: string, _newPassword: string) {
    await delay(600);
    return { success: true };
  },

  // Profile
  async getProfile(): Promise<User> {
    await delay(300);
    const stored = localStorage.getItem('user');
    if (!stored) throw new Error('Not authenticated');
    return JSON.parse(stored);
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    await delay(500);
    const stored = localStorage.getItem('user');
    if (!stored) throw new Error('Not authenticated');
    const user = { ...JSON.parse(stored), ...data, profileComplete: true };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  // Health Data
  async getHealthData(): Promise<HealthData[]> {
    await delay(300);
    const stored = localStorage.getItem('health_data');
    if (stored) return JSON.parse(stored);
    // Generate sample data for past 7 days
    const data: HealthData[] = Array.from({ length: 7 }, (_, i) => {
      const sleep = Math.round((5 + Math.random() * 4) * 10) / 10;
      const steps = Math.round(3000 + Math.random() * 9000);
      const water = Math.round((4 + Math.random() * 6) * 10) / 10;
      const stress = Math.round(1 + Math.random() * 9);
      const diet = Math.round(1 + Math.random() * 9);
      const score = Math.round(
        (sleep / 9) * 25 + (steps / 12000) * 25 + (water / 10) * 20 + ((10 - stress) / 10) * 15 + (diet / 10) * 15
      );
      return {
        id: crypto.randomUUID(), userId: 'demo',
        sleepHours: sleep, stepsWalked: steps, waterIntake: water,
        stressLevel: stress, dietQuality: diet,
        healthScore: Math.min(score, 100),
        date: format(addDays(new Date(), -6 + i), 'yyyy-MM-dd'),
      };
    });
    localStorage.setItem('health_data', JSON.stringify(data));
    return data;
  },

  async addHealthData(entry: Omit<HealthData, 'id' | 'userId' | 'healthScore'>): Promise<HealthData> {
    await delay(500);
    const score = Math.round(
      (entry.sleepHours / 9) * 25 + (entry.stepsWalked / 12000) * 25 +
      (entry.waterIntake / 10) * 20 + ((10 - entry.stressLevel) / 10) * 15 +
      (entry.dietQuality / 10) * 15
    );
    const newEntry: HealthData = {
      ...entry, id: crypto.randomUUID(), userId: 'demo',
      healthScore: Math.min(Math.max(score, 0), 100),
    };
    const stored = localStorage.getItem('health_data');
    const data = stored ? JSON.parse(stored) : [];
    data.push(newEntry);
    localStorage.setItem('health_data', JSON.stringify(data));
    return newEntry;
  },

  // Diet Plan
  async getDietPlan(date: string): Promise<DietPlan> {
    await delay(400);
    return {
      userId: 'demo', date,
      breakfast: ['Oatmeal with berries & flaxseeds', 'Green smoothie with spinach & banana', 'Whole grain toast with avocado'],
      lunch: ['Grilled salmon with quinoa', 'Mixed green salad with chickpeas', 'Steamed broccoli & sweet potato'],
      dinner: ['Lentil soup with whole wheat bread', 'Stir-fried tofu with vegetables', 'Brown rice with kidney beans'],
      snacks: ['Greek yogurt with honey', 'Trail mix with almonds & dried cranberries', 'Apple slices with peanut butter'],
      ironFoods: ['Spinach', 'Lentils', 'Dark chocolate', 'Pumpkin seeds', 'Chickpeas'],
      proteinFoods: ['Eggs', 'Greek yogurt', 'Salmon', 'Quinoa', 'Almonds'],
      groceryList: ['Oats', 'Berries', 'Spinach', 'Salmon', 'Quinoa', 'Lentils', 'Sweet potato', 'Tofu', 'Greek yogurt', 'Almonds', 'Flaxseeds', 'Avocado'],
    };
  },

  // Chatbot
  async sendMessage(message: string): Promise<string> {
    await delay(1200);
    const responses: Record<string, string> = {
      pcos: "**PCOS (Polycystic Ovary Syndrome)** affects 1 in 10 women. Common symptoms include irregular periods, weight gain, acne, and excess hair growth. Management includes:\n\n- Regular exercise (150 min/week)\n- Low-glycemic diet rich in whole grains\n- Stress management through yoga or meditation\n- Adequate sleep (7-8 hours)\n\nMedications like metformin or hormonal contraceptives may be prescribed.",
      pms: "**PMS (Premenstrual Syndrome)** affects up to 75% of menstruating women. Tips to manage:\n\n- Reduce salt, sugar, and caffeine intake\n- Exercise regularly\n- Take calcium and magnesium supplements\n- Practice relaxation techniques\n- Stay hydrated",
      period: "**Menstrual Health Tips:**\n\n- Track your cycle regularly\n- Use a heating pad for cramps\n- Stay hydrated and eat iron-rich foods\n- Light exercise can help reduce pain\n- Rest when needed",
      default: "Thank you for your question about women's health. Here are some general wellness tips:\n\n- Maintain a balanced diet rich in iron and calcium\n- Exercise regularly (at least 30 minutes daily)\n- Get 7-8 hours of quality sleep\n- Stay hydrated (8-10 glasses of water daily)\n- Schedule regular health check-ups\n- Practice stress management techniques",
    };
    const lower = message.toLowerCase();
    const key = Object.keys(responses).find(k => k !== 'default' && lower.includes(k)) || 'default';
    return responses[key] + "\n\n---\n⚠️ **Medical Disclaimer:** This information is for educational purposes only and should not replace professional medical advice. Please consult a qualified healthcare provider for diagnosis and treatment.";
  },

  // Period Tracker
  async getPeriodData(): Promise<{ lastPeriodDate: string; cycleLength: number }> {
    await delay(300);
    const user = localStorage.getItem('user');
    if (user) {
      const { lastPeriodDate, cycleLength } = JSON.parse(user);
      return { lastPeriodDate: lastPeriodDate || format(addDays(new Date(), -14), 'yyyy-MM-dd'), cycleLength: cycleLength || 28 };
    }
    return { lastPeriodDate: format(addDays(new Date(), -14), 'yyyy-MM-dd'), cycleLength: 28 };
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};
