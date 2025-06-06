package com.exam.controller;

import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.dto.QuizDTO;
import com.exam.entity.User;
import com.exam.entity.exam.Category;
import com.exam.entity.exam.Quiz;
import com.exam.services.QuizService;
import com.exam.services.UserService;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/quiz")
public class QuizController {

    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);

	
    @Autowired
    private QuizService quizService;

    @Autowired
    private UserService userService;

    // Create a Quiz
    @PostMapping("/")
    public ResponseEntity<Quiz> add(@RequestBody Quiz quiz) {
        String username = getCurrentUsername();
        User user = userService.getUser(username);
        quiz.setCreatedBy(user);
        return ResponseEntity.ok(quizService.addQuiz(quiz));
    }

    // Update a Quiz
    @PutMapping("/")
    public ResponseEntity<Quiz> update(@RequestBody Quiz quiz) {
        String username = getCurrentUsername();
        quizService.getQuiz(quiz.getId(), username); // Validate ownership of the quiz
        return ResponseEntity.ok(quizService.updateQuiz(quiz));
    }

    // Get all Quizzes
    @GetMapping("/")
    public ResponseEntity<Set<Quiz>> quizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }
    
 // Get all quizzes created by the current user
    @GetMapping("/my-quizzes")
    public ResponseEntity<List<Quiz>> getMyQuizzes() {
        String username = getCurrentUsername(); // Get the username of the logged-in user
        logger.info("Fetching quizzes for user: {}", username); // Log the username

        List<Quiz> quizzes = quizService.getQuizzesCreatedByUser(username); // Fetch quizzes created by this user
        return ResponseEntity.ok(quizzes);
    }
    
    @PutMapping("/{qid}/settings")
    public ResponseEntity<?> updateQuizSettings(
            @PathVariable Long qid,
            @RequestBody QuizDTO settingsDto) {

        String username = getCurrentUsername();
        Quiz quiz = quizService.getQuiz(qid, username); // validate ownership

        quiz.setTimeLimit(settingsDto.getTimeLimit());
        quiz.setQuestionsOrder(settingsDto.getQuestionsOrder());
        quiz.setStartTime(settingsDto.getStartTime());
        quiz.setEndTime(settingsDto.getEndTime());
        quiz.setQuestionsPerSession(settingsDto.getQuestionsPerSession());

        quizService.updateQuiz(quiz);

        logger.info("Updated settings for quiz {} by user {}", qid, username);
        return ResponseEntity.ok(quiz);
    }

    
    @PutMapping("/{qid}")
    public ResponseEntity<?> updateQuizInfo(@PathVariable Long qid, @RequestBody QuizDTO request) {
    	String username = getCurrentUsername();
        Quiz quiz = quizService.getQuiz(qid, username); // validate ownership

        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());

        quizService.updateQuiz(quiz);

        logger.info("Updated settings for quiz {} by user {}", qid, username);
        return ResponseEntity.ok(quiz);

    }


    // Get a Single Quiz
    @GetMapping("/{qid}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long qid) {
        Quiz quiz = quizService.getQuiz(qid);
        return ResponseEntity.ok(quiz);
    }

    // Delete a Quiz
    @DeleteMapping("/{qid}")
    public ResponseEntity<Void> delete(@PathVariable("qid") Long qid) {
        String username = getCurrentUsername();
        quizService.getQuiz(qid, username); // Validate ownership of the quiz
        this.quizService.deleteQuiz(qid);
        return ResponseEntity.noContent().build();
    }

    // Get Quizzes by Category
    @GetMapping("/category/{cid}")
    public ResponseEntity<List<Quiz>> getQuizzesOfCategory(@PathVariable("cid") Long cid) {
        Category category = new Category();
        category.setCid(cid);
        return ResponseEntity.ok(quizService.getQuizzesOfCategory(category));
    }

    // Get Active Quizzes
    @GetMapping("/active")
    public ResponseEntity<List<Quiz>> getActiveQuizzes() {
        return ResponseEntity.ok(quizService.getActiveQuizzes());
    }

    // Get Active Quizzes by Category
    @GetMapping("/category/active/{cid}")
    public ResponseEntity<List<Quiz>> getActiveQuizzes(@PathVariable("cid") Long cid) {
        Category category = new Category();
        category.setCid(cid);
        return ResponseEntity.ok(quizService.getActiveQuizzesOfCategory(category));
    }

    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (principal instanceof UserDetails)
            ? ((UserDetails) principal).getUsername()
            : principal.toString();
    }
}
