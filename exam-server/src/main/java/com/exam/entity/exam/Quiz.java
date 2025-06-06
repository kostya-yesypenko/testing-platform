package com.exam.entity.exam;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.exam.entity.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
@Table(name = "quiz")
public class Quiz {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String title;
	private String description;
	@Column(name = "number_of_questions", columnDefinition = "varchar(255) default '0'")
	private String numberOfQuestions = "0";

	@Column(name = "time_limit")
	private Integer timeLimit=600;  // null = no time limit
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer questionsPerSession;
	private String questionsOrder = "inOrder";
	
	private boolean active = false;

	@ManyToOne(fetch = FetchType.EAGER)
	private Category category;

	@OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	@JsonManagedReference
	private List<Question> questions = new ArrayList<>();

	
    @ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "created_by")
	private User createdBy;



	public Quiz() {
	}

//	@Override
//	public String toString() {
//		return "Quiz{" + "qid=" + id + ", title='" + title + '\'' + ", description='" + description + '\'' + ", maxMarks='" + maxMarks + '\'' + ", numberOfQuestion='" + numberOfQuestions + '\'' + ", active=" + active + '}';
//	}

}
