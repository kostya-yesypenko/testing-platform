package com.exam.entity.exam;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;
@Entity
@Data
@Table(name = "test_session")
public class TestSession {

    @Id
    private String id; // UUID or generated token

    private String userName;

    private Long examId;

    private Instant startTime;

    private Integer timeLimit;

    private boolean isCompleted;

    @Column(name = "current_question_index")
    private Integer currentQuestionIndex;

    private Integer totalQuestionsNumber;
    
    private Integer score = 0;

    private int maxPoints;


    @ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "test_session_remaining_questions",
        joinColumns = @JoinColumn(name = "session_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions = new ArrayList<>();
}
