package com.exam;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.exam.entity.exam.Question;
import com.exam.entity.exam.Quiz;
import com.exam.repo.QuestionRepository;
import com.exam.services.Impl.QuestionServiceImpl;
import com.exam.services.QuizService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class QuestionServiceImplTest {

    @InjectMocks
    private QuestionServiceImpl questionService;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuizService quizService;

    @Test
    void testAddQuestion() {
        Quiz quiz = new Quiz();
        quiz.setId(1L);
        quiz.setNumberOfQuestions("0");
        quiz.setQuestions(new ArrayList<>());

        Question question = new Question();
        question.setQuestionText("What is Java?");
        question.setQuiz(quiz);

        when(quizService.getQuiz(1L)).thenReturn(quiz);
        when(quizService.updateQuiz(any(Quiz.class))).thenReturn(quiz);
        when(questionRepository.save(any(Question.class))).thenReturn(question);

        Question saved = questionService.addQuestion(question);

        assertEquals("What is Java?", saved.getQuestionText());
        verify(questionRepository).save(question);
    }

    @Test
    void testGetQuestion_ReturnsCorrectQuestion() {
        Question question = new Question();
        question.setQuesId(1L);
        question.setQuestionText("Sample?");

        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));

        Question result = questionService.getQuestion(1L);

        assertNotNull(result);
        assertEquals(1L, result.getQuesId());
        assertEquals("Sample?", result.getQuestionText());
    }

    @Test
    void testGetQuestion_ThrowsIfNotFound() {
        when(questionRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> questionService.getQuestion(100L));
    }

    @Test
    void testGetQuestions() {
        List<Question> list = new ArrayList<>();
        list.add(new Question());
        list.add(new Question());

        when(questionRepository.findAll()).thenReturn(list);

        List<Question> result = questionService.getQuestions();

        assertEquals(2, result.size());
    }



    @Test
    void testGetQuestionsOfQuiz_WithQuizObject() {
        Quiz quiz = new Quiz();
        quiz.setId(2L);
        List<Question> questions = new ArrayList<>();
        questions.add(new Question());
        questions.add(new Question());

        when(questionRepository.findByQuiz(quiz)).thenReturn(questions);

        List<Question> result = questionService.getQuestionsOfQuiz(quiz);

        assertEquals(2, result.size());
        verify(questionRepository).findByQuiz(quiz);
    }

}
