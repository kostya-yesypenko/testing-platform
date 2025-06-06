package com.exam.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class QuizDTO {
    private String title;
    private String description;
    private Integer timeLimit;
    private String questionsOrder;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer questionsPerSession;

}
