CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    protein INT NOT NULL,
    carbs INT NOT NULL,
    fats INT NOT NULL,
    calories INT NOT NULL
);

INSERT INTO meals (name, protein, carbs, fats, calories) 
VALUES ('Chicken Breast & Rice', 40, 45, 5, 385);