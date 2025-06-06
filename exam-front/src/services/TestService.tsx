import { urlBase } from "../consts";
import { Result, TestSession } from "../types";

// ✅ Start a new session
export const startSession = async (
  userName: string,
  examId: number
): Promise<{ sessionToken: string }> => {
  const response = await fetch(
    `${urlBase}/test/session/start?userName=${encodeURIComponent(
      userName
    )}&examId=${examId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Помилка початку сесії");
  }

  const json: TestSession = await response.json();
  return { sessionToken: json.id }; // ✅ wrap session ID as token
};

// ✅ Get an active session by token
export const getSession = async (
  sessionToken: string
): Promise<TestSession> => {
 
  const response = await fetch(`${urlBase}/test/session/${sessionToken}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response);
  if (!response.ok) {
    throw new Error("Помилка отримання сесії");
  }

  return await response.json();
};

export const sendAnswer = async (
  questionId: number,
  givenAnswers: string[] | number[]
): Promise<boolean> => {
  const sessionToken = localStorage.getItem("currentSessionToken");

  const response = await fetch(
    `${urlBase}/test/session/${sessionToken}/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId,
        givenAnswers,
      }),
    }
  );
  console.log(
    JSON.stringify({
      questionId,
      givenAnswers,
    })
  );
  if (!response.ok) {
    throw new Error("Помилка надсилання відповіді");
  }

  const json = await response.json();
  return json;
};

export const getTestResults = async (sessionToken: string): Promise<Result> => {
  const response = await fetch(
    `${urlBase}/test/session/${sessionToken}/getTestResults`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Помилка отримання показників");
  }

  const json = await response.json();
  return json;
};

export const saveTestResult = async (result: Result): Promise<void> => {
  const response = await fetch(`${urlBase}/quiz/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });

  if (!response.ok) {
    throw new Error("Помилка збереження результату");
  }
};

// TestService.ts
export const deleteTestSession = async (sessionToken: string): Promise<void> => {
  const response = await fetch(`${urlBase}/test/session/${sessionToken}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Помилка видалення сесії");
  }
};
