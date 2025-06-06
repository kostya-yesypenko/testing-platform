package com.exam.services;

import java.util.Optional;

import com.exam.dto.AnswerRequest;
import com.exam.entity.exam.TestSession;

public interface TestSessionService {

    TestSession startSession(String userName, Long examId);

    Optional<TestSession> getSession(String sessionId);

    TestSession updateProgress(String sessionId, TestSession updatedSession);

    void completeSession(String sessionId);

	TestSession submitAnswer(String sessionId, AnswerRequest answerRequest);

	boolean deleteSession(String sessionId);
}
