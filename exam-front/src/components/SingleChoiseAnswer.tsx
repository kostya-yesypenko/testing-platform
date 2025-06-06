import { useState } from "react";
import { SelectableAnswer } from "../types";

export default ({
  answers,
  onSubmit,
}: {
  answers: SelectableAnswer[];
  onSubmit: (selectedAnswerText: string) => void;
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  return (
    <>
      <p>Тільки одна відповідь</p>
      {answers
        .map((answer, index) => (
          <button
            key={index}
            className={`answer full-width ${selectedAnswer === index ? "answer-selected" : ""}`}
            onClick={() => setSelectedAnswer(index)}
          >
            <div className="answer-first-row">
              <p>
                {index + 1}. {answer.answerText}
              </p>
            </div>
          </button>
        ))}
      <button
        className="button full-width"
        onClick={() => {
          if (selectedAnswer !== null) {
            const answerText = answers[selectedAnswer].answerText;
            setSelectedAnswer(null);
            onSubmit(answerText);
          }
        }}
      >
        Наступне питання
      </button>
    </>
  );
};
