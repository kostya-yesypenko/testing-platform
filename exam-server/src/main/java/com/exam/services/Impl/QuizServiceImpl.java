package com.exam.services.Impl;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.entity.exam.Category;
import com.exam.entity.exam.Question;
import com.exam.entity.exam.Quiz;
import com.exam.repo.CategoryRepository;
import com.exam.repo.QuizRepository;
import com.exam.services.QuestionService;
import com.exam.services.QuizService;

@Service
public class QuizServiceImpl implements QuizService {

	@Autowired
	private QuizRepository quizRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	@Lazy
	private QuestionService questionService;

	public Quiz addQuiz(Quiz quiz) {
	    // Check if category exists and is provided
	    if (quiz.getCategory() != null && quiz.getCategory().getCid() != null) {
	        Category category = categoryRepository.findById(quiz.getCategory().getCid())
	                .orElseThrow(() -> new RuntimeException("Category not found"));
	        quiz.setCategory(category);
	    } else {
	        // If no category is provided, set category to null
	        quiz.setCategory(null);
	    }
	    
	    // Save the quiz and return it
	    return quizRepository.save(quiz);
	}



//	@Transactional
//	public Quiz createQuizWithQuestions(Quiz quiz, Set<Question> questions) {
//		Quiz savedQuiz = quizRepository.save(quiz);
//		for (Question q : questions) {
//			q.setQuiz(savedQuiz);
//			questionService.validateQuestion(q); // optional reuse if you extract the validator
//			questionService.addQuestion(q);
//		}
//		return savedQuiz;
//	}

	@Override
	public Quiz updateQuiz(Quiz quiz) {
		return this.quizRepository.save(quiz);
	}
	
	@Override
	public List<Quiz> getQuizzesCreatedByUser(String username) {
	    // Fetch quizzes by the user who created them
	    return quizRepository.findByCreatedByUsername(username);
	}



	@Override
	public Set<Quiz> getAllQuizzes() {
		return new LinkedHashSet<>(this.quizRepository.findAll());
	}

	@Override
	public Quiz getQuiz(Long quizId) {
	    Quiz quiz = quizRepository.findById(quizId)
	        .orElseThrow(() -> new RuntimeException("Quiz not found with ID: " + quizId));

//	    if (!quiz.isActive()) {
//	        throw new AccessDeniedException("This quiz is not active or publicly accessible.");
//	    }

	    return quiz;
	}

	public Quiz getQuiz(Long quizId, String currentUsername) {
	    Quiz quiz = quizRepository.findById(quizId)
	        .orElseThrow(() -> new RuntimeException("Quiz not found with ID: " + quizId));

	    return quiz;
	}



	@Override
	public void deleteQuiz(Long quizId) {
		quizRepository.deleteById(quizId);
	}

	@Override
	public List<Quiz> getQuizzesOfCategory(Category category) {
		return this.quizRepository.findByCategory(category);
	}

	// get active quizzes

	@Override
	public List<Quiz> getActiveQuizzes() {
		return this.quizRepository.findByActive(true);
	}

	@Override
	public List<Quiz> getActiveQuizzesOfCategory(Category c) {
		return this.quizRepository.findByCategoryAndActive(c, true);
	}


}
