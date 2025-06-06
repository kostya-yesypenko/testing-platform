import { useState } from "react";
import CreateOpenEndedQuestionForm from "./CreateOpenEndedQuestionForm";
import CreateMultipleChoiseQuestionForm from "./CreateMultipleChoiseQuestionForm.tsx";
import { Question, QuestionType, SelectableAnswer } from "../types.tsx";
import CreateSingleChoiseQuestionForm from "./CreateSingleChoiseQuestionForm.tsx";

export default ({ startingValues, onSubmit }: {
    startingValues?: { quesId: number, imageFile?: File | string, questionType: QuestionType, startingPoints?: number, startingQuestionText: string, startingAnswerText?: string, startingAnswers?: SelectableAnswer[] },
    onSubmit: (newQuestion: Question) => void
}) => {
    const [questionType, setQuestionType] = useState<QuestionType>(startingValues?.questionType ?? "MULTIPLE_CHOICE");

    return (
        <div className="add-new-question-form">
            <p className="field-title">Тип питання</p>
            <select className="text-input color-dark" value={questionType}
                onChange={(e) => {
                    setQuestionType(e.target.value as QuestionType);
                }}>
                <option value="MULTIPLE_CHOICE">Вибір декількох</option>
                <option value="SINGLE_CHOICE">Вибір одного</option>
                <option value="TEXT">Відкрите питання</option>
            </select>

            {questionType === "TEXT" &&
                <CreateOpenEndedQuestionForm startingValues={startingValues} onSubmit={onSubmit} />
            }

            {questionType === "MULTIPLE_CHOICE" &&
                <CreateMultipleChoiseQuestionForm startingValues={startingValues} onSubmit={onSubmit} />
            }

            {questionType === "SINGLE_CHOICE" &&
                <CreateSingleChoiseQuestionForm startingValues={startingValues} onSubmit={onSubmit} />
            }

        </div>
    )
}