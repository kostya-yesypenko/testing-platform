import { urlBase } from "../consts";
import { Exam, Question, Result, Settings } from "../types";

export const createExam = async (title: string): Promise<Exam> => {
  const response = await fetch(`${urlBase}/quiz/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      title,
    }),
  });

  if (!response.ok) {
    throw new Error("Помилка створення екзамену");
  }

  const json = await response.json();

  return json;
};

export const getExamsList = async (): Promise<Exam[]> => {
  const response = await fetch(`${urlBase}/quiz/my-quizzes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Помилка отримання списку екзаменів");
  }

  const json = await response.json();

  return json;
};

export const getExamData = async (examId: string): Promise<Exam> => {
  const data = await fetch(`${urlBase}/quiz/${examId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const json = await data.json();
  if (json.startTime) json.startTime = new Date(json.startTime);
  if (json.endTime) json.endTime = new Date(json.endTime);
  return json;
};

export const createQuestion = async (
  examId: string,
  {
    imageFile,
    questionType,
    points,
    questionText,
    answerText,
    answers,
  }: Question
) => {
  const formData = new FormData();
  formData.append("examId", examId);
  if (imageFile) {
    formData.append("imageFile", imageFile);
  }
  formData.append("questionText", questionText);
  formData.append("questionType", questionType);
  formData.append("points", points.toString());
  if (answerText) {
    formData.append("answerText", answerText);
  }
  if (imageFile) {
    formData.append("imageFile", imageFile); // exact name matches DTO
  }
  if (answers) {
    formData.append("answers", JSON.stringify(answers));
  }

  const response = await fetch(`${urlBase}/question/${examId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  console.log(JSON.stringify(formData));
  if (!response.ok) {
    throw new Error("Помилка створення питання");
  }

  const json = await response.json();

  return json;
};

export const updateQuestion = async (
  questionId: number,
  { questionType, points, questionText, answerText, answers, imageFile }: Question
) => {
  const formData = new FormData();
  formData.append("questionId", questionId.toString());
  if (imageFile) {
    formData.append("imageFile", imageFile);
  }
  formData.append("questionText", questionText);
  formData.append("questionType", questionType);
  formData.append("points", points.toString());
  if (answerText) {
    formData.append("answerText", answerText);
  }
  if (imageFile) {
    formData.append("imageFile", imageFile); // exact name matches DTO
  }
  if (answers) {
    formData.append("answers", JSON.stringify(answers));
  }
  const response = await fetch(`${urlBase}/question/${questionId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Помилка створення питання");
  }

  const json = await response.json();

  return json;
};

export const deleteExam = async (examId: string): Promise<void> => {
  const response = await fetch(`${urlBase}/quiz/${examId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Помилка видалення екзамену");
  }
};

export const deleteQuestion = async (qid: number): Promise<void> => {
  const response = await fetch(`${urlBase}/question/${qid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete question with id ${qid}`);
  }
};

export const getQuestions = async (examId: string): Promise<Question[]> => {
  const response = await fetch(`${urlBase}/question?examId=${examId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Помилка отримання питань");
  }

  const json = await response.json();

  return json;
};

export const getResults = async (examId: string): Promise<Result[]> => {
  const response = await fetch(`${urlBase}/quiz/${examId}/results`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Помилка отримання показників");
  }

  const json = await response.json();

  return json;
};

export const getSettings = async (examId: string): Promise<Settings> => {
  const response = await fetch(`${urlBase}/quiz/${examId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Помилка отримання показників");
  }

  const json = await response.json();
  if (json.startTime) json.startTime = new Date(json.startTime);
  if (json.endTime) json.endTime = new Date(json.endTime);
  return json;
};

export const updateSettings = async (examId: string, settings: Settings) => {
  console.log(
    JSON.stringify({
      ...settings,
      startTime: settings.startTime
        ? new Date(
            settings.startTime?.getTime() -
              settings.startTime.getTimezoneOffset()
          )
        : undefined,
      endTime: settings.endTime
        ? new Date(settings.endTime?.getTime())
        : undefined,
    })
  );
  const response = await fetch(`${urlBase}/quiz/${examId}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      ...settings,
      startTime: settings.startTime
        ? new Date(
            settings.startTime?.getTime() -
              settings.startTime.getTimezoneOffset()
          )
        : undefined,
    }),
  });

  if (!response.ok) {
    throw new Error("Помилка отримання нашалштувань");
  }

  const json = await response.json();

  return json;
};

export const updateExamData = async (
  examId: string,
  data: Pick<Exam, "title" | "description">
) => {
  const response = await fetch(`${urlBase}/quiz/${examId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Помилка оновлення даних тесту");
  }

  const json = await response.json();
  return json;
};
