package com.exam.services.Impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exam.entity.exam.Question;
import com.exam.entity.exam.Quiz;
import com.exam.repo.QuestionRepository;
import com.exam.services.QuestionService;
import com.exam.services.QuizService;

@Service
public class QuestionServiceImpl implements QuestionService {

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuizService quizService;

	@Override
	public Question addQuestion(Question question) {
		// Validate first

		// Fetch the full quiz from the DB
		Long quizId = question.getQuiz().getId();
		Quiz quiz = quizService.getQuiz(quizId);

		// Set the managed Quiz entity to the question
		question.setQuiz(quiz);
		quiz.getQuestions().add(question);
		int currentCount = Integer.parseInt(quiz.getNumberOfQuestions());
		quiz.setNumberOfQuestions(String.valueOf(currentCount + 1));
		quizService.updateQuiz(quiz);

		// Now save the question with correct association
		return questionRepository.save(question);
	}

	public Question updateQuestion(Question updatedQuestion) {
	    return questionRepository.save(updatedQuestion);
	}


	@Override
	public List<Question> getQuestions() {
		return new ArrayList<>(questionRepository.findAll());
	}

	@Override
	public Question getQuestion(Long questionId) {
		return questionRepository.findById(questionId).orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));
	}

	@Override
	public List<Question> getQuestionsOfQuiz(Quiz quiz) {
		return questionRepository.findByQuiz(quiz);
	}

	@Override
	public void deleteQuestion(Long questionId) {
	    Question question = questionRepository.findById(questionId)
	        .orElseThrow(() -> new RuntimeException("Question not found"));

	    // Видаляємо зв'язок із Quiz
	    Quiz quiz = question.getQuiz();
	    if (quiz != null) {
	        quiz.getQuestions().remove(question);
	    }

	    questionRepository.delete(question);
	}

	@Override
	public Optional<Question> getQuestionById(Long questionId) {
	    return questionRepository.findById(questionId);
	}



}
