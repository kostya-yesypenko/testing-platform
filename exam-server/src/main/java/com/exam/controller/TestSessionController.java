package com.exam.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.HttpStatus;

import com.exam.dto.AnswerRequest;
import com.exam.dto.ResultDTO;
import com.exam.entity.exam.Question;
import com.exam.entity.exam.Quiz;
import com.exam.entity.exam.TestSession;
import com.exam.services.QuizService;
import com.exam.services.TestSessionService;

@RestController
@RequestMapping("/test/session")
public class TestSessionController {

    @Autowired
    private QuizService quizService;
    
    @Autowired
    private TestSessionService testSessionService;

    @PostMapping("/start")
    public ResponseEntity<TestSession> startSession(@RequestParam String userName, @RequestParam Long examId) {
        TestSession session = testSessionService.startSession(userName, examId);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<TestSession> getSession(@PathVariable String sessionId) {
        return testSessionService.getSession(sessionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{sessionId}/answer")
    public ResponseEntity<TestSession> submitAnswer(
            @PathVariable String sessionId,
            @RequestBody AnswerRequest answerRequest) {
        TestSession updatedSession = testSessionService.submitAnswer(sessionId, answerRequest);
        return ResponseEntity.ok(updatedSession);
    }
    
    @GetMapping("/{sessionId}/getTestResults")
    public ResponseEntity<ResultDTO> getTestResults(@PathVariable String sessionId) {
        Optional<TestSession> sessionOptional = testSessionService.getSession(sessionId);

        if (sessionOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TestSession session = sessionOptional.get();
        Long examId = session.getExamId(); 
        Quiz quiz = quizService.getQuiz(examId);

        int score = session.getScore();
        int maxPoints = session.getMaxPoints();
        return ResponseEntity.ok(new ResultDTO(score, maxPoints));

    }

    @PutMapping("/{sessionId}")
    public ResponseEntity<TestSession> updateSession(@PathVariable String sessionId, @RequestBody TestSession update) {
        TestSession updated = testSessionService.updateProgress(sessionId, update);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<Void> completeSession(@PathVariable String sessionId) {
        testSessionService.completeSession(sessionId);
        return ResponseEntity.ok().build();
    }

    // DELETE endpoint to remove the session by ID
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable String sessionId) {
        boolean isDeleted = testSessionService.deleteSession(sessionId);
        if (isDeleted) {
            return ResponseEntity.noContent().build(); // HTTP 204 No Content if deletion is successful
        } else {
            return ResponseEntity.notFound().build(); // HTTP 404 Not Found if session doesn't exist
        }
    }
}
