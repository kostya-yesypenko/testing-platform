package com.exam.entity.exam;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long examId;         // corresponds to examId
    private String user;

    private double points;
    private double maxPoints;

    private Double timeTaken;

    private LocalDateTime submittedAt;
}
