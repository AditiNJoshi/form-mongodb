const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const fs = require('fs');

mongoose.connect('mongodb://0.0.0.0:27017/quiz-app', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.get('/quiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
  })

app.use(express.static('public'));

const quizData = JSON.parse(fs.readFileSync('quiz-data.json', 'utf8'));

async function seedDatabase() {
    try {
        await Quiz.insertMany(quizData);
        console.log('Quiz data seeded successfully.');
    } catch (error) {
        console.error('Error seeding quiz data:', error);
    }
}

seedDatabase(); 
// Server Code
app.get('/questions', async (req, res) => {
    try {
        const questions = await Quiz.find({}, 'question');
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/submit-quiz', async (req, res) => {
    const submittedAnswers = req.body;
    let score = 0;

    const correctAnswers = await Quiz.find({});

    for (let i = 0; i < correctAnswers.length; i++) {
        const questionId = `q${i + 1}`;
        const userAnswer = submittedAnswers[questionId];
        const correctAnswer = correctAnswers[i].correctAnswer;

        if (userAnswer === correctAnswer) {
            score++;
        }
    }

    res.json({ score });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/quiz.html`);
});
