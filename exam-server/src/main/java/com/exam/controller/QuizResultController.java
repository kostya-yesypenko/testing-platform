package com.exam.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.exam.entity.exam.Question;
import com.exam.entity.exam.Quiz;
import com.exam.entity.exam.QuizResult;
import com.exam.repo.QuizResultRepository;
import com.exam.services.QuestionService;
import com.exam.services.QuizService;
@RestController
@RequestMapping("/quiz")
public class QuizResultController {

    @Autowired
    private QuizResultRepository quizResultRepository;
    

    // Existing POST method to save quiz results
    @PostMapping("/results")
    public ResponseEntity<QuizResult> saveResult(@RequestBody QuizResult result) {
        result.setSubmittedAt(LocalDateTime.now());
        QuizResult saved = quizResultRepository.save(result);
        return ResponseEntity.ok(saved);
    }

    // New GET method to retrieve results based on examId
    @GetMapping("/{examId}/results")
    public ResponseEntity<List<QuizResult>> getResultsByExamId(@PathVariable Long examId) {
        // Fetch results for the given examId
        List<QuizResult> results = quizResultRepository.findByExamId(examId);
        
        if (results.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 if no results are found
        }

        return ResponseEntity.ok(results);
    }
}
