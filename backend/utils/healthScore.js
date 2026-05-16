export const calculateHealthScore = (data) => {
  let score = 0;

  // 🔥 SAFE VALUES (avoid undefined / NaN)
  const sleep = data.sleepHours || 0;
  const water = data.waterIntake || 0;
  const steps = data.stepsWalked || 0;
  const diet = data.dietQuality || 0;
  const stress = data.stressLevel || 0;

  // 🔥 BASIC HEALTH METRICS
  score += (sleep / 8) * 20;
  score += (water / 8) * 15;
  score += (steps / 8000) * 20;
  score += (diet / 10) * 15;
  score += ((10 - stress) / 10) * 10;

  // 🍱 MEALS LOGIC
  if (data.meals?.protein) score += 5;
  if (data.meals?.fruits) score += 5;
  if (data.meals?.junk) score -= 10;

  // 🤖 AI SUGGESTIONS FOLLOWED
  const suggestions = data.suggestionsFollowed || 0;
  score += suggestions * 2;

  // 🔥 NORMALIZE SCORE (0 - 100)
  score = Math.round(score);

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return score;
};