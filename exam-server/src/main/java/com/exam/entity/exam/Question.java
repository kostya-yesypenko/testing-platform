package com.exam.entity.exam;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Data
@Table(name = "question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long quesId;
    @Column(length = 5000)
    private String questionText;
    private String imageFile;
    private Integer points;
    private String answerText;
    
    @Enumerated(EnumType.STRING)
    private QuestionType questionType;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "question_answers", joinColumns = @JoinColumn(name = "question_id"))
    private List<SelectableAnswer> answers = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    private Quiz quiz;


    public Question() {
    }

    @JsonIgnore
    public boolean isTextQuestion() {
        return this.questionType == QuestionType.TEXT;
    }

    @JsonIgnore
    public boolean isMultipleChoice() {
        return questionType == QuestionType.MULTIPLE_CHOICE;
    }

    @JsonIgnore
    public boolean isSingleChoice() {
        return questionType == QuestionType.SINGLE_CHOICE;
    }

}
