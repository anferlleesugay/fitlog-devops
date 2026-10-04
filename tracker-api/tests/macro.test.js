const assert = require('assert');
const { test } = require('node:test');
const { validateAndCalculateMeal } = require('../src/server');

test('Calculates total calories correctly', () => {
  const meal = { name: 'Chicken & Rice', protein: 30, carbs: 40, fats: 10, ingredients: ['Chicken', 'Rice'] };
  const result = validateAndCalculateMeal(meal, []);
  assert.strictEqual(result.totalCalories, 370);
});

test('Blocks meal if forbidden ingredient is present', () => {
  const meal = { name: 'Pork Chops', protein: 25, carbs: 0, fats: 15, ingredients: ['Pork'] };
  assert.throws(() => {
    validateAndCalculateMeal(meal, ['pork']);
  }, /Meal contains excluded dietary items/);
});