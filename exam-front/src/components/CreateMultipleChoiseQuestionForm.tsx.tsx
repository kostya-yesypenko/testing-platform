import { useState } from "react";
import { createQuestion, updateQuestion } from "../services/ExamService.tsx";
import DeleteIcon from "../assets/icons/DeleteIcon.tsx";
import { Question, SelectableAnswer } from "../types.tsx";

export default ({ startingValues, onSubmit }:
    {
        startingValues?: { quesId: number, imageFile?: File | string, startingPoints?: number, startingQuestionText: string, startingAnswers?: SelectableAnswer[] },
        onSubmit: (newQuestion: Question) => void
    }
) => {
    const [pointsString, setPointsString] = useState(startingValues?.startingPoints?.toString() ?? "5");
    const [questionText, setQuestionText] = useState(startingValues?.startingQuestionText ?? "");
    const [answers, setAnswers] = useState<{ isCorrect: boolean; answerText: string }[]>(startingValues?.startingAnswers ?? [
        { isCorrect: false, answerText: "" },
        { isCorrect: false, answerText: "" },
        { isCorrect: false, answerText: "" }
    ]);

    const [imageFile, setImageFile] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>(
        typeof startingValues?.imageFile === "string" ? `http://localhost:8080/uploads/images/${encodeURIComponent(
            startingValues?.imageFile
        )}` : ""
    );

    const [errors, setErrors] = useState<{
        pointsError?: string;
        questionError?: string;
        answerError?: string[];
        correctAnswerError?: string;
        minimumAnswerError?: string;
    }>({});

    const validateFields = () => {
        const newErrors: typeof errors = {};
        const parsedPoints = Number(pointsString);

        if (!pointsString.trim() || isNaN(parsedPoints)) {
            newErrors.pointsError = "Введіть вірне число";
        }

        if (!questionText.trim()) {
            newErrors.questionError = "Введіть питання";
        }

        const answerErrors: string[] = [];
        answers.forEach((answer, index) => {
            if (!answer.answerText.trim()) {
                answerErrors[index] = "Введіть відповідь";
            }
        });
        if (answerErrors.length > 0) {
            newErrors.answerError = answerErrors;
        }

        if (!answers.some(a => a.isCorrect)) {
            newErrors.correctAnswerError = "Позначте принаймні одну правильну відповідь";
        }

        if (answers.length < 2) {
            newErrors.minimumAnswerError = "Має бути принаймні дві відповіді";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateAnswer = (index: number, field: "answerText" | "isCorrect", value: string | boolean) => {
        setAnswers(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const removeAnswer = (index: number) => {
        setAnswers(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className="answer-second-row">
                <p>Кількість балів</p>
                <input
                    className="text-input color-dark"
                    value={pointsString}
                    onChange={(e) => setPointsString(e.target.value)}
                />
                {errors.pointsError && <p className="error-text">{errors.pointsError}</p>}
            </div>

            <p className="field-title">Питання</p>
            <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="text-area create-question-text-area"
            />
            {errors.questionError && <p className="error-text">{errors.questionError}</p>}

            <p className="field-title">Додати зображення</p>
            <input
                type="file"
                accept="image/*"
                className="file-input"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (reader.result) {
                                setImagePreview(reader.result.toString());
                                setImageFile(file);
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                }}
            />
            {imagePreview && (
                <div className="image-preview">
                    <img src={imagePreview} alt="Preview" className="preview-image" />
                </div>
            )}

            <div>
                {answers.map((answer, index) => (
                    <div className="answer" key={index}>
                        <div className="answer-first-row">
                            <div>{index + 1}.</div>
                            <div>
                                <span>Правильна відповідь</span>
                                <input
                                    type="checkbox"
                                    className="correct-answer-checkbox"
                                    checked={answer.isCorrect}
                                    onChange={(e) => updateAnswer(index, "isCorrect", e.target.checked)}
                                />
                            </div>
                            <button onClick={() => removeAnswer(index)}>
                                <DeleteIcon />
                            </button>
                        </div>
                        <textarea
                            className="text-area create-question-text-area"
                            value={answer.answerText}
                            onChange={(e) => updateAnswer(index, "answerText", e.target.value)}
                        />
                        {errors.answerError?.[index] && (
                            <p className="error-text">{errors.answerError[index]}</p>
                        )}
                    </div>
                ))}

                {errors.correctAnswerError && (
                    <p className="error-text">{errors.correctAnswerError}</p>
                )}
                {errors.minimumAnswerError && (
                    <p className="error-text">{errors.minimumAnswerError}</p>
                )}

                <button
                    className="button"
                    onClick={() => {
                        setAnswers(prev => [...prev, { isCorrect: false, answerText: "" }]);
                    }}
                >
                    Додати відповідь
                </button>
            </div>

            <button
                className="button full-width"
                onClick={async () => {
                    if (validateFields()) {
                        const examId = localStorage.getItem("examId");
                        const newQuestion: Question = {
                            quesId: 0,
                            questionType: "MULTIPLE_CHOICE",
                            imageFile,
                            points: Number(pointsString),
                            questionText,
                            answers
                        };

                        if (!startingValues?.quesId) {
                            const { quesId } = await createQuestion(examId ?? "", newQuestion);
                            onSubmit({ ...newQuestion, quesId });
                        } else {
                            const { quesId, imageFile } = await updateQuestion(startingValues?.quesId, newQuestion);
                            onSubmit({ ...newQuestion, quesId, imageFile });
                        }
                    }
                }}
            >
                Додати питання
            </button>
        </>
    );
};
