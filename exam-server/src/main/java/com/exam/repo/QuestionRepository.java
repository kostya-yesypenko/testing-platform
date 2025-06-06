package com.exam.repo;

import com.exam.entity.exam.Question;
import com.exam.entity.exam.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question,Long> {
    List<Question> findByQuiz(Quiz quiz);
}
