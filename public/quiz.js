document.addEventListener("DOMContentLoaded", function () {
    const quizForm = document.getElementById("quiz-form");
    const quizResults = document.getElementById("quiz-results");

    quizForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(quizForm);
        const answers = {};

        for (const [name, value] of formData) {
            answers[name] = value;
        }

        // Your scoring logic goes here (similar to previous examples)

        // For example, calculate the score based on correct answers (assuming correct answers are known)
        const correctAnswers = {
            q1: "Paris",
            q2: "7",
            q3: "Madrid",
            q4: "7",
            q5: "7",
            q6: "7",
            q7: "7",
            q8: "7",
            
        };

        let score = 0;
        for (const question in correctAnswers) {
            if (answers[question] === correctAnswers[question]) {
                score++;
            }

        }
        if (score >= 0 && score <= 4) {
            score = 0;
        } else if (score >= 5 && score <= 7) {
            score = 1;
        } else {
            score = 2;
        }

        // Map the score based on your requirements (0-4, 5-7, 8-10, etc.)
        // ...

        // Display the result
        quizResults.innerHTML = `<p>Hello, ${answers.username}! Your score is: ${score}</p>`;
    });
});
