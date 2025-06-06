import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import EditIcon from "../assets/icons/EditIcon.tsx";
import DeleteIcon from "../assets/icons/DeleteIcon.tsx";
import CreateQuestionForm from "../components/CreateQuestionForm.tsx";
import { Question } from "../types.tsx";
import { createQuestion, deleteQuestion, getQuestions } from "../services/ExamService.tsx";
import SidebarNav from "../components/SidebarNav.tsx";
import { useNavigate } from "react-router-dom";

export default () => {
  const [isQuestionsModalShown, setIsQuestionModalShown] = useState(false);
  const [isImportModalShown, setIsImportModalShown] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);

  const [importedFile, setImportedFile] = useState<File | null>(null);

  const [questionsList, setQuestionsList] = useState<Question[]>([]);

  const navigate = useNavigate();
  const examId = localStorage.getItem("examId");

  useEffect(() => {
    getQuestions(examId ?? "")
      .then((questions: Question[]) => {
        setQuestionsList(questions);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        if (error.code === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
  }, []);

  return (
    <>
      <SidebarNav />
      <div className="page-container">
        <div>
          <h1 className="page-title">Питання</h1>
          {isQuestionsModalShown && (
            <Modal
              onClose={() => {
                setIsQuestionModalShown(false);
              }}
            >
              <CreateQuestionForm
                startingValues={editingQuestionIndex === -1 ? undefined : {
                  quesId: questionsList[editingQuestionIndex].quesId,
                  imageFile: questionsList[editingQuestionIndex].imageFile,
                  questionType: questionsList[editingQuestionIndex].questionType,
                  startingAnswers: questionsList[editingQuestionIndex].answers,
                  startingAnswerText: questionsList[editingQuestionIndex].answerText,
                  startingQuestionText: questionsList[editingQuestionIndex].questionText,
                  startingPoints: questionsList[editingQuestionIndex].points
                }}
                onSubmit={(newQuestion) => {
                  if (editingQuestionIndex === -1)
                    setQuestionsList(() => {
                      return [...questionsList, newQuestion];
                    });
                  else {
                    setQuestionsList(() => {
                      return questionsList.slice(0, editingQuestionIndex)
                        .concat(newQuestion, questionsList.slice(editingQuestionIndex + 1));
                    });
                  }
                  setIsQuestionModalShown(false);
                }}
              />
            </Modal>
          )}

          {isImportModalShown && (
            <Modal
              onClose={() => {
                setIsImportModalShown(false);
              }}
            >
              <div className="import-modal">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImportedFile(file);
                    }
                  }}
                />
                {importedFile && (
                  <button
                    className="button"
                    onClick={() => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const text = event.target?.result as string;
                        try {
                          const parsedQuestions = JSON.parse(text);

                          const isValid = parsedQuestions.every(
                            (q: unknown) => {
                              if (!(typeof q === "object") || q === null)
                                return false;
                              const keys = Object.keys(q);
                              return (
                                ["questionType", "points", "questionText"].every((key) => keys.includes(key)) &&
                                ["answerText", "answers"].some((key) => keys.includes(key)) &&
                                ((q as Question).questionType === "TEXT" ||
                                  (q as Question).questionType === "MULTIPLE_CHOICE" ||
                                  (q as Question).questionType === "SINGLE_CHOICE") &&
                                !isNaN((q as Question).points)
                              )
                            }
                          );

                          if (isValid) {
                            Promise.all(parsedQuestions.map((q: Question) => createQuestion(examId ?? "", q)))
                            setQuestionsList(parsedQuestions);
                            setIsImportModalShown(false);
                            setIsImportModalShown(false);
                            setImportedFile(null);
                          } else {
                            alert("Невірний формат файлу.");
                          }
                        } catch (error) {
                          console.error("Помилка обробки:", error);
                          alert("Помилка при обробці файлу.");
                        }
                      };
                      reader.readAsText(importedFile);
                    }}
                  >
                    Застосувати
                  </button>
                )}
              </div>
            </Modal>
          )}

          <div className="buttons-container">
            <button
              className="button"
              onClick={() => {
                setIsImportModalShown(true);
              }}
            >
              Імпортувати питання
            </button>
            <button
              className="button"
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([JSON.stringify(questionsList)], { type: "text/json" });
                element.href = URL.createObjectURL(file);
                element.download = "Питання";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              Експортувати питання
            </button>
          </div>

          <div className="table">
            <div className="table-row-header">
              <div className="table-cell w-[20px]">#</div>
              <div className="table-cell w-[300px]">Вид питання</div>
              <div className="table-cell">Питання</div>
            </div>
            {questionsList.map((question, index) => {
              return (
                <div className="table-row">
                  <div className="flex ml-[8px]">
                    <div className="table-cell w-[20px]">{index + 1}</div>
                    <div className="table-cell w-[300px]">
                      {(() => {
                        switch (question.questionType) {
                          case "MULTIPLE_CHOICE":
                            return "Вибір з декількох варіантів";
                          case "SINGLE_CHOICE":
                            return "Вибір з одного варіанта";
                          case "TEXT":
                            return "Відкрите питання";
                          default:
                            return "";
                        }
                      })()}
                    </div>
                    <div className="table-cell">{question.questionText}</div>
                  </div>
                  <div className="flex mr-[8px]">
                    <div className="table-cell w-[24px]">
                      <button onClick={async () => {
                        setEditingQuestionIndex(index);
                        setIsQuestionModalShown(true);
                        // try {
                        //   await (question.quesId);
                        //   setQuestionsList(
                        //     questionsList.filter((q) => q.quesId !== question.quesId)
                        //   );
                        // } catch (error) {
                        //   console.error(
                        //     "Помилка при видаленні питання:",
                        //     error
                        //   );
                        //   alert("Не вдалося видалити питання.");
                        // }
                      }}>
                        <EditIcon />
                      </button>
                    </div>
                    <div className="table-cell w-[24px]">
                      <button
                        onClick={async () => {
                          try {
                            await deleteQuestion(question.quesId);
                            setQuestionsList(
                              questionsList.filter((q) => q.quesId !== question.quesId)
                            );
                          } catch (error) {
                            console.error(
                              "Помилка при видаленні питання:",
                              error
                            );
                            alert("Не вдалося видалити питання.");
                          }
                        }}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="button"
            onClick={() => {
              setIsQuestionModalShown(true);
            }}
          >
            Створити питання
          </button>
        </div>
      </div >
    </>
  );
};
