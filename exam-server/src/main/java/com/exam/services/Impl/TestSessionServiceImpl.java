package com.exam.services.Impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exam.dto.AnswerRequest;
import com.exam.entity.exam.Question;
import com.exam.entity.exam.Quiz;
import com.exam.entity.exam.SelectableAnswer;
import com.exam.entity.exam.TestSession;
import com.exam.repo.QuestionRepository;
import com.exam.repo.QuizRepository;
import com.exam.repo.TestSessionRepository;
import com.exam.services.TestSessionService;

@Service
public class TestSessionServiceImpl implements TestSessionService {

	@Autowired
	private TestSessionRepository testSessionRepository;

	@Autowired
	private QuizRepository quizRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Override
	public TestSession startSession(String userName, Long examId) {
		Quiz quiz = quizRepository.findById(examId).orElseThrow(() -> new RuntimeException("Quiz not found with id: " + examId));

		List<Question> allQuestions = new ArrayList<>(quiz.getQuestions()); // Mutable copy of all quiz questions

		// Randomize question order if needed
		if ("random".equalsIgnoreCase(quiz.getQuestionsOrder())) {
			Collections.shuffle(allQuestions);
		}

		int questionsPerSession = quiz.getQuestionsPerSession() != null ? quiz.getQuestionsPerSession() : allQuestions.size();

		if (questionsPerSession > allQuestions.size()) {
			questionsPerSession = allQuestions.size();
		}

		List<Question> selectedQuestions = allQuestions.subList(0, questionsPerSession);

		// Перемішуємо відповіді у вибраних питаннях
		for (Question question : selectedQuestions) {
			if (question.getAnswers() != null && !question.getAnswers().isEmpty()) {
				Collections.shuffle(question.getAnswers());
			}
		}

		TestSession session = new TestSession();
		session.setId(UUID.randomUUID().toString());
		session.setUserName(userName);
		session.setExamId(examId);
		session.setStartTime(Instant.now());
		session.setTimeLimit(quiz.getTimeLimit());
		session.setCompleted(false);
		session.setQuestions(selectedQuestions);
		session.setTotalQuestionsNumber(selectedQuestions.size());
		session.setCurrentQuestionIndex(0);
		int maxPoints = selectedQuestions.stream().mapToInt(Question::getPoints).sum();
		session.setMaxPoints(maxPoints);

		return testSessionRepository.save(session);
	}

	@Override
	public Optional<TestSession> getSession(String sessionId) {
		return testSessionRepository.findById(sessionId);
	}

	@Override
	public TestSession updateProgress(String sessionId, TestSession updatedSession) {
		TestSession session = testSessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));

		session.setQuestions(updatedSession.getQuestions());
		session.setCurrentQuestionIndex(updatedSession.getCurrentQuestionIndex());
		session.setTotalQuestionsNumber(updatedSession.getTotalQuestionsNumber());
		session.setCompleted(updatedSession.isCompleted());

		return testSessionRepository.save(session);
	}

	@Override
	public void completeSession(String sessionId) {
		TestSession session = testSessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
		session.setCompleted(true);
		testSessionRepository.save(session);
	}

	public TestSession submitAnswer(String sessionId, AnswerRequest answerRequest) {
		// Retrieve the session by its ID
		TestSession session = testSessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));

		// Retrieve the question using the question ID from the request
		Question question = questionRepository.findById(answerRequest.getQuestionId()).orElseThrow(() -> new RuntimeException("Question not found"));

		// Check if the answer is correct by comparing it with the question's correct
		// answers
		boolean isCorrect = checkAnswerCorrectness(question, answerRequest.getGivenAnswers());

		// If the answer is correct, add the question's points to the score
		if (isCorrect) {
			session.setScore(session.getScore() + question.getPoints());
		}

		// Remove the answered question from the remaining questions list
		session.getQuestions().removeIf(q -> q.getQuesId().equals(answerRequest.getQuestionId()));

		// Update the index to the next question
		session.setCurrentQuestionIndex(session.getCurrentQuestionIndex() + 1);

		// If there are no more questions, mark the session as completed
		if (session.getQuestions().isEmpty()) {
			session.setCompleted(true);
		}

		// Save the updated session to the database
		return testSessionRepository.save(session);
	}

	private boolean checkAnswerCorrectness(Question question, List<String> givenAnswers) {
		if (question.isTextQuestion()) {
			return givenAnswers.size() == 1 && question.getAnswerText().trim().equalsIgnoreCase(givenAnswers.get(0).trim());
		}

		List<String> correctAnswers = question.getAnswers().stream().filter(SelectableAnswer::isCorrect).map(SelectableAnswer::getAnswerText).toList();

		return new HashSet<>(correctAnswers).equals(new HashSet<>(givenAnswers));
	}

	@Override
	public boolean deleteSession(String sessionId) {
		try {
			TestSession session = testSessionRepository.findById(sessionId).orElse(null);
			if (session != null) {
				testSessionRepository.delete(session);
				return true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false; // Return false if session not found or deletion failed
	}

}
