package com.exam.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.exam.dto.QuestionDTO;
import com.exam.entity.exam.Question;
import com.exam.entity.exam.Quiz;
import com.exam.entity.exam.SelectableAnswer;
import com.exam.services.QuestionService;
import com.exam.services.QuizService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/question")
public class QuestionController {

	@Autowired
	private QuestionService questionService;

	@Autowired
	private QuizService quizService;

	@PostMapping("/{examId}")
	public ResponseEntity<Question> addQuestion(@ModelAttribute QuestionDTO dto, @PathVariable Long examId) {

		Quiz quiz = quizService.getQuiz(examId);

		Question question = new Question();
		question.setQuiz(quiz);
		question.setQuestionText(dto.getQuestionText());
		question.setPoints(dto.getPoints());
		question.setQuestionType(dto.getQuestionType());
		question.setAnswerText(dto.getAnswerText());

		// Handle optional file
		if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
			// save to disk or DB and set filename
			String fileName = saveImage(dto.getImageFile());
			question.setImageFile(fileName);
		}

		// Parse JSON string to List<SelectableAnswer>
		if (dto.getAnswers() != null && !dto.getAnswers().isEmpty()) {
			try {
				ObjectMapper objectMapper = new ObjectMapper();
				List<SelectableAnswer> answers = objectMapper.readValue(dto.getAnswers(), new TypeReference<List<SelectableAnswer>>() {
				});
				question.setAnswers(answers);
			} catch (Exception e) {
				return ResponseEntity.badRequest().build();
			}
		}

		return ResponseEntity.ok(questionService.addQuestion(question));
	}

	private String saveImage(MultipartFile file) {
		try {
			String uploadDir = "uploads/images/";
			String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
			Path filePath = Paths.get(uploadDir + filename);
			Files.createDirectories(filePath.getParent());
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			return filename;
		} catch (IOException e) {
			throw new RuntimeException("Could not save image", e);
		}
	}


//    //add question
//    @PostMapping("/{examId}")
//    public ResponseEntity<Question> add(@RequestBody Question question, @PathVariable Long examId) {
//        Quiz quiz = quizService.getQuiz(examId);
//        question.setQuiz(quiz);
//        return ResponseEntity.ok(this.questionService.addQuestion(question));
//    }
	@PutMapping("/{questionId}")
	public ResponseEntity<Question> updateQuestion(
	        @PathVariable Long questionId,
	        @ModelAttribute QuestionDTO dto) {
	    
	    Optional<Question> optionalQuestion = questionService.getQuestionById(questionId);
	    if (optionalQuestion.isEmpty()) {
	        return ResponseEntity.notFound().build();
	    }

	    Question existing = optionalQuestion.get();
	    existing.setQuestionText(dto.getQuestionText());
	    existing.setPoints(dto.getPoints());
	    existing.setQuestionType(dto.getQuestionType());
	    existing.setAnswerText(dto.getAnswerText());

	    // Handle optional image
	    if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
	        String filename = saveImage(dto.getImageFile());
	        existing.setImageFile(filename);
	    }

	    // Handle JSON answers
	    if (dto.getAnswers() != null && !dto.getAnswers().isEmpty()) {
	        try {
	            ObjectMapper mapper = new ObjectMapper();
	            List<SelectableAnswer> answers = mapper.readValue(dto.getAnswers(), new TypeReference<>() {});
	            existing.setAnswers(answers);
	        } catch (Exception e) {
	            return ResponseEntity.badRequest().build();
	        }
	    }

	    return ResponseEntity.ok(questionService.updateQuestion(existing));
	}



	@GetMapping
	public ResponseEntity<List<Question>> getQuestionsByExamId(@RequestParam("examId") Long examId) {
		Quiz quiz = this.quizService.getQuiz(examId);
		return ResponseEntity.ok(quiz.getQuestions());
	}

	// Get all Questions
	@GetMapping("/")
	public ResponseEntity<List<Question>> questions() {
		return ResponseEntity.ok(this.questionService.getQuestions());
	}

	// Get single Question
	@GetMapping("/{qid}")
	public ResponseEntity<Question> getQuestion(@PathVariable("qid") Long qid) {
		return ResponseEntity.ok(this.questionService.getQuestion(qid));
	}

	// Delete Question
	@DeleteMapping("/{qid}")
	public ResponseEntity<Void> delete(@PathVariable("qid") Long qid) {
		questionService.deleteQuestion(qid);
		return ResponseEntity.noContent().build();
	}

	// Get Questions for a Quiz for Users (randomized and limited)
	@GetMapping("/by-quiz/{qid}")
	public ResponseEntity<List<Question>> getQuestionsOfQuiz(@PathVariable("qid") Long qid) {
		Quiz quiz = this.quizService.getQuiz(qid);
		List<Question> questions = quiz.getQuestions();

		List<Question> list = new ArrayList<>(questions);
		int numberOfQuestions = Integer.parseInt(quiz.getNumberOfQuestions());

		if (list.size() > numberOfQuestions) {
			list = list.subList(0, numberOfQuestions);
		}

		Collections.shuffle(list);
		return ResponseEntity.ok(list);
	}

	// Get Questions for a Quiz (Admin - full list)
	@GetMapping("/by-quiz/admin/{qid}")
	public ResponseEntity<List<Question>> getQuestionsOfQuizAdmin(@PathVariable("qid") Long qid) {
		Quiz quiz = this.quizService.getQuiz(qid);
		return ResponseEntity.ok(quiz.getQuestions());
	}

}
