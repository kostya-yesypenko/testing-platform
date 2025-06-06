package com.exam.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.exam.entity.exam.QuestionType;
import com.exam.entity.exam.SelectableAnswer;

import lombok.Data;

@Data
public class QuestionDTO {
    private String questionText;
    private Integer points;
    private QuestionType questionType;
    private String answerText;              // для TEXT
    private String answers; // JSON stringified list of SelectableAnswer
    private MultipartFile imageFile;            // тут прийде файл
}
