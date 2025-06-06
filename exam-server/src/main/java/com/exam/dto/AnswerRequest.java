package com.exam.dto;

import java.util.List;

import lombok.Data;

@Data
public class AnswerRequest {
    private Long questionId;
    private List<String> givenAnswers; // Для текстових або мульти-вибір
}
