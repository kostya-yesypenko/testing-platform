package com.exam.entity.exam;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelectableAnswer {
    private String answerText;

    @JsonProperty("isCorrect")
    private boolean isCorrect;
}
