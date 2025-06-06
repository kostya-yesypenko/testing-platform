package com.exam.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.exam.entity.exam.TestSession;

@Repository
public interface TestSessionRepository extends JpaRepository<TestSession, String> {
    Optional<TestSession> findById(String id); // already included in JpaRepository
}
