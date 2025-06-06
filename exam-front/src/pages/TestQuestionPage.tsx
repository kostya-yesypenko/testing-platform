/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { Question } from "../types";
import { useNavigate } from "react-router-dom";
import { getSession, sendAnswer } from "../services/TestService";
import SingleChoiseAnswer from "../components/SingleChoiseAnswer";
import MultipleChoiseAnswer from "../components/MultipleChoiseAnswer";
import TextAnswer from "../components/TextAnswer";

export default () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([
    {
      quesId: 1,
      answers: [],
      questionType: "TEXT",
      points: 0,
      questionText: "",
    },
  ]);
  const [questionsNumber, setQuestionsNumber] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
  }>({ minutes: 0, seconds: 0 });
  const sessionToken = localStorage.getItem("currentSessionToken");

  useEffect(() => {
    const callback = async () => {
      getSession(sessionToken || "")
        .then(async (data) => {
          const startTime = new Date(data.startTime);

          if (
            data.completed ||
            (data.timeLimit &&
              startTime.getTime() + data.timeLimit * 1000 < Date.now())
          ) {
            navigate("/test/result");
          } else {
            setQuestions(data.questions);
            setQuestionsNumber(data.totalQuestionsNumber);

            if (data.timeLimit) {
              const interval = setInterval(() => {
                const currentTime = Date.now();
                const timeDiff = Math.floor(
                  data.timeLimit - (currentTime - startTime.getTime()) / 1000
                );
                const minutesLeft = Math.floor(timeDiff / 60);
                const secondsLeft = timeDiff % 60;
                setTimeLeft({ minutes: minutesLeft, seconds: secondsLeft });
              }, 1000);
              return () => clearInterval(interval);
            }
          }
        })
        .catch((error) => {
          console.error("Помилка отримання даних:", error);
          navigate("/test/start");
        });
    };
    callback();
  }, []);

  const onSubmit = (answer: string | string[]) => {
    const currentQuestion = questions[0];
    const normalizedAnswers = Array.isArray(answer) ? answer : [answer];

    sendAnswer(currentQuestion.quesId, normalizedAnswers)
      .then(() => {
        if (questions.length > 1) {
          setQuestions((prev) => prev.slice(1));
        } else {
          navigate("/test/result");
        }
      })
      .catch((error) => {
        console.error("Помилка надсилання відповіді:", error);
      });
  };

  // Визначаємо назву файлу картинки для безпечного вставлення в URL
  const imageFileName = questions?.[0]?.imageFile
    ? typeof questions[0].imageFile === "string"
      ? questions[0].imageFile
      : questions[0].imageFile.name || ""
    : "";

  return (
    <>
      <div className="test-start-page center-container">
        <div className="test-container">
          <div className="test-time-limit">
            <p>
              Час до закінчення:{" "}
              {timeLeft.minutes ? `${timeLeft.minutes} хв.` : ""}{" "}
              {timeLeft.seconds} сек.
            </p>
          </div>

          {questions && (
            <p>
              {questionsNumber - questions.length + 1} з {questionsNumber}
            </p>
          )}

          {imageFileName && (
            <div className="question-image">
              <img
                src={`http://localhost:8080/uploads/images/${encodeURIComponent(
                  imageFileName
                )}`}
                alt="Question"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginBottom: "1rem",
                }}
              />
            </div>
          )}

          <h1 className="test-title">{questions?.[0].questionText}</h1>

          {questions?.[0].questionType === "SINGLE_CHOICE" &&
            questions?.[0].answers && (
              <SingleChoiseAnswer
                answers={questions[0].answers}
                onSubmit={onSubmit}
              />
            )}

          {questions?.[0].questionType === "MULTIPLE_CHOICE" &&
            questions?.[0].answers && (
              <MultipleChoiseAnswer
                answers={questions[0].answers}
                onSubmit={onSubmit}
              />
            )}

          {questions?.[0].questionType === "TEXT" && (
            <TextAnswer onSubmit={onSubmit} />
          )}
        </div>
      </div>
    </>
  );
};
