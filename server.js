const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const Quiz = require('./models/Quiz');
const Score = require('./models/Score');

mongoose.connect('mongodb://0.0.0.0:27017/quiz-app', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.get('/quiz.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/questions', async (req, res) => {
  try {
      const questions = await Quiz.find({}, 'question');
      res.json(questions);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
app.use(express.static('public'));

app.post('/submit-quiz', async (req, res) => {
  const { username, ...submittedAnswers } = req.body;
    let score = 0;

    const correctAnswers = await Quiz.find({}, 'correctAnswer');

    for (let i = 0; i < correctAnswers.length; i++) {
        const questionId = `q${i + 1}`;
        const userAnswer = submittedAnswers[questionId];
        const correctAnswer = correctAnswers[i].correctAnswer;

        if (userAnswer === correctAnswer) {
            score++;
        }
    }

    // Save the score to the database
    const newScore = new Score({ username,score });
    await newScore.save();

    res.json({ username,score });
});

const port = process.env.PORT || 30008;
app.listen(port, () => {
    console.log(`Server is running on port Server is running on port http://localhost:${port}/quiz.html`);
});
