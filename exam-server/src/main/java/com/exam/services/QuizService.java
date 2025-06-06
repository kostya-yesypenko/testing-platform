package com.exam.services;

import com.exam.entity.exam.Category;
import com.exam.entity.exam.Quiz;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface QuizService {
    public Quiz addQuiz(Quiz quiz);
    public Quiz updateQuiz(Quiz quiz);
    public Set<Quiz> getAllQuizzes();
    Quiz getQuiz(Long quizId); // тільки активний квіз, публічний
    Quiz getQuiz(Long quizId, String currentUsername); // тільки для власника
    public void deleteQuiz(Long quizId);

    List<Quiz> getQuizzesOfCategory(Category category);

    public List<Quiz> getActiveQuizzes();
    public List<Quiz> getActiveQuizzesOfCategory(Category c);
	public List<Quiz> getQuizzesCreatedByUser(String username);
}
