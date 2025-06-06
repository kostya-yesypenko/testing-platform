package com.exam.services;

import java.util.List;
import java.util.Optional;

import com.exam.entity.exam.Question;
import com.exam.entity.exam.Quiz;

public interface QuestionService {

    public Question addQuestion(Question question);
    public Question updateQuestion(Question question);
    public List<Question> getQuestions();
    public Question getQuestion(Long questionId);
    public List<Question> getQuestionsOfQuiz(Quiz quiz);
    public void deleteQuestion(Long questionId);
	public Optional<Question> getQuestionById(Long questionId);

}
