
'use strict';

function handleStartQuiz(questionBank, question) {	
	$('.js-start-quiz-button').click(function() {
		$('.js-start-quiz').remove();
		const questionSet = renderQuestionPrompt(questionBank, question);
		$('.js-question').html(questionSet);
		//renderQuestionTracker(questionBank, question);})

		console.log(`handleStartQuiz() has ran`);
})
}

// renders question section (uses renderQuestion and renderChoices)
function renderQuestionPrompt(questionBank, question) {
	$('.js-question').addClass('question-box');
	return `
		${renderQuestionCount(questionBank, question)}
		${renderQuestion(questionBank, question)}
		<div class="row">
			<div class="col-6">
	      		<form id="js-choices" class="question-choices">
	        		${renderChoices(questionBank, question)}
	        		<br>
	          		<input type = "submit" class="js-submit-answer" value="Submit Answer">
	      		<form>
	      	</div>
	    </div>`;
	console.log(`questionPrompt() has ran`);
}

// renders question count
function renderQuestionCount(questionBank, question) {
	return `<div class="col-12">
				<h2>Question ${question.count} of ${questionBank.length}</h2>
			</div>`;
}

// renders question (used in renderQuestonPrompt)
function renderQuestion(questionBank, question) {
	const index = question.count - 1;
	const askedQuestion = questionBank[index].question;
	return `<div class="col-6 question">  
		      <p>${askedQuestion}</p>
		    </div>`;
}

// renders answer choices (used in renderQuestonPrompt)
function renderChoices(questionBank, question){
	const index = question.count - 1;
	const choiceArray = questionBank[index].choices;
	console.log(choiceArray);
	const choices = choiceArray.map(choice => `
		<label>
         	<input type="radio" name="choices" value="${choice}">
          	${choice}
          	<br>
         </label>`);
	return choices.join("");
}

/*function renderQuestionTracker(questionBank, question) {
	const questionCount = question.count;

	const correctAnswers = function() {
		let count = 0;
		for (let i = 0; questionBank.length > i; i++) {
			if (questionBank[i].correct === true) {
				count++;
			}
		}
		return count;
	}
	const questionNumber = function() {
		if (questionCount <= 10) {
			return questionCount;
		} else { return 10 }
	}
	const questionTracker = `
		<h2>Question Tracker</h2>
      	<p>
        	[graphical representation of progress will appear here]
      	</p>
      	<p>
        	You are on question ${questionNumber()} of 10
      	</p>`;
	$('.js-question-tracker').html(questionTracker);
	console.log(`renderQuestionTracker() has ran`);
}*/

// handles submit answer button click (uses checkAnswer, renderQuestionFeedback, updateQuestionCount, renderScoreTracker)
function handleSubmitAnswer(questionBank, question) {
	$('.js-question').on('click', '.js-submit-answer', event => {
		console.log(`submit clicked`)
		event.preventDefault();
		checkAnswer(questionBank, question);
		renderQuestionFeedback(questionBank, question)
		updateQuestionCount(question);		
		renderScoreTracker(questionBank, question);
		console.log(`handleSubmitAnswer() has ran`)
	})
}

function checkAnswer(questionBank, question) {
	const index = question.count - 1;
	const userAnswer = $('input[name=choices]:checked', '#js-choices').val();
	const correctAnswer = questionBank[index].correctAnswer();
	console.log('user answer ', userAnswer);
	if (userAnswer === correctAnswer) {
		questionBank[index].correct = true;
	} else {
		questionBank[index].correct = false;
	}
	questionBank[index].answered = true;
	console.log(`checkAnswer() has ran, answer was ${questionBank[index].correct}, answered is ${questionBank[index].answered}`);
}

function renderQuestionFeedback(questionBank, question) {
	const index = question.count - 1;
	const button = function() {
		if (question.count === 10) {
			return `
				<button class="js-next-question">See Results</button> `
		} else {
			return `
				<button class="js-next-question">Next Question</button>`
		}
	}
	const questionFeedback = function () {
		if (questionBank[index].correct === true) {
			return `
				<div class="col-2"></div>
				<div class="col-4 question-feedback">
					<img src="https://leslieannetarabella.com/wp-content/uploads/2018/04/heart.jpg" alt="correct answer red heart">
					<div class="question-result">Correct!</div>
				</div>
				<div class="col-6 answer-explanation-correct">
					<p>explanation of answer</p>
					${button()}
				</div>`;
		} else {
			return `
				<div class="col-8 answer-explanation-incorrect">
					<p>The correct answer is ${questionBank[index].correctAnswer()}</p>
					${button()}
				</div>
				<div class="col-4 question-feedback">
					<img src="https://image.ibb.co/bN2Fi8/redcross.png" alt="redcross">
					<div class="question-result">Incorrect!</div>
				</div>
		`;
		}
	}
	console.log(`renderQuestionFeedback() has ran`);
	$('.js-question').html(questionFeedback);
}

/*function renderFeedbackImage(questionBank, question) {
	const index = question.count - 1;
	if (questionBank[index].correct === true) {
		return `
			<img src="https://leslieannetarabella.com/wp-content/uploads/2018/04/heart.jpg" alt="correct answer red heart">`
	} else {
		return `
			<img src="https://cdn.vectorstock.com/i/1000x1000/96/01/x-red-cross-brush-paint-stroke-hand-drawn-blood-vector-18049601.jpg" alt="correct answer red heart">`
	}
}*/	

function updateQuestionCount(question) {
	if (question.count === 11) {
		question.count = 1;
	} else {
	question.count++;
	}
	console.log(`updateQuestionCount() has ran, count is ${question.count}`);
}

function renderScoreTracker(questionBank, question) {
	const questionCount = question.count - 1;

	const correctAnswers = function() {
		let count = 0;
		for (let i = 0; questionBank.length > i; i++) {
			if (questionBank[i].correct === true) {
				count++;
			}
		}
		return count;
	}
	const scoreTracker = `
      	<p>
        	Correct answers: ${correctAnswers()} out of ${questionCount}
      	</p>`;
	$('.js-score-tracker').html(scoreTracker);
	console.log(`renderScoreTracker() has ran`);
}

function handleNextQuestion(questionBank, question) {
	$('.js-question').on('click', '.js-next-question', event => {
		console.log(`handleNextQuestion() has ran`);

		if (question.count > 10) {
			$('.js-question').html(renderFinalScoreReveal(questionBank))
			$('.js-question-tracker, .js-score-tracker').empty();	
		} else {
			$('.js-question').html(renderQuestionPrompt(questionBank, question))
			//renderQuestionTracker(questionBank, question);
		}
	})		
}

function renderFinalScoreReveal(questionBank) {
	const correctAnswers = function() {
		let count = 0;
		for (let i = 0; questionBank.length > i; i++) {
			if (questionBank[i].correct === true) {
				count++;
			}
		}
		return count;
	}	
	const scoreReveal = `
		<p>
        	Well done you completed the quiz with a hearty score of ${correctAnswers()}/10
      	</p>			
        <button class="js-restart">Take Quiz Again</button>`
	console.log(`renderScoreReveal() has ran`);
	$('.js-question').html(scoreReveal);
}	

function handleStartNewQuiz(questionBank, question) {
	$('.js-question').on('click', '.js-restart', event => {
		console.log(`handleStartNewQuiz() has ran`);
		console.log(questionBank, ' ', question);
		updateQuestionCount();
		console.log(question.count);
		resetQuestionArray(questionBank, question);
		$('.js-score-tracker').empty();
		const questionSet = renderQuestionPrompt(questionBank, question);
		$('.js-question').html(questionSet);
		//renderQuestionTracker(questionBank, question);
		})
}

function resetQuestionArray(questionBank, question) {
	for (let i = 0; questionBank.length < i; i++) {
		questionBank[i].answered === false;
		questionBank[i].correct === null;
		question.count = 1;
	}
	console.log(`resetQuestionArray() has ran`);
}

function handleCardiacQuiz() {
	//function to run on .ready
	handleStartQuiz(cardiacQuestionBank, cardiacQuestions);
	handleSubmitAnswer(cardiacQuestionBank, cardiacQuestions);
	handleNextQuestion(cardiacQuestionBank, cardiacQuestions);
	handleStartNewQuiz(cardiacQuestionBank, cardiacQuestions)
	console.log(`handleCardiacQuiz() has ran`);
}

$(handleCardiacQuiz);