const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'fitlog_user',
  password: process.env.DB_PASSWORD || 'fitlogpassword',
  database: process.env.DB_NAME || 'fitlogdb',
  port: 5432,
});

function validateAndCalculateMeal(meal, exclusions = []) {
  const containsExclusion = exclusions.some((item) =>
    meal.ingredients.map((i) => i.toLowerCase()).includes(item.toLowerCase())
  );

  if (containsExclusion) {
    throw new Error('Meal contains excluded dietary items');
  }

  const totalCalories = meal.protein * 4 + meal.carbs * 4 + meal.fats * 9;
  return { ...meal, totalCalories };
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'tracker-api' });
});

app.post('/api/calculate', (req, res) => {
  try {
    const { meal, exclusions } = req.body;
    const result = validateAndCalculateMeal(meal, exclusions);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`tracker-api running on port ${PORT}`));

module.exports = { validateAndCalculateMeal };