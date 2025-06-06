package com.exam.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.exam.QuizResult;

import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

	List<QuizResult> findByExamId(Long examId);
}
