/* eslint-disable react-refresh/only-export-components */
import { getExamData } from "../services/ExamService";
import { startSession } from "../services/TestService";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Exam } from "../types";

export default () => {
    const navigate = useNavigate();
    const [examData, setExamData] = useState<
        Pick<Exam, "title" | "description">
        & Pick<Exam["settings"], "startTime">
        & Pick<Exam["settings"], "endTime">
    >
        ({ title: "назва", description: "опис" });

    const [userName, setUserName] = useState<string>("");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const examId = queryParams.get("examId")


    useEffect(() => {
        const currentSessionToken = localStorage.getItem("currentSessionToken");
        if (currentSessionToken) {
            navigate("/test/question");
        } else {
            getExamData(examId ?? "").then((_examData: Exam) => {
                setExamData(_examData);
            }).catch((error) => {
                console.error("Помилка отримання даних:", error);
            })
        }
    }, []);
    console.log(examData)
    return (
        <div className="test-start-page center-container">
            <div className="test-container">
                <h1 className="test-title">{examData.title}</h1>
                <p>
                    {examData.description}
                </p>
                {((examData.startTime && Date.now() < examData.startTime.getTime()) ||
                    (examData.endTime && Date.now() > examData.endTime.getTime())
                    
                ) ?
                    <>
                        Цей екзамен доступний {examData.startTime ? `з ${examData.startTime.toLocaleDateString()} ${examData.startTime.toLocaleTimeString()} ` : ""} {examData.endTime ? `до ${examData.endTime.toLocaleDateString()} ${examData.endTime.toLocaleTimeString()} ` : ""}
                    </>
                    :
                    <>
                        < input type="text" className="text-input" placeholder="Ваше ім'я" value={userName}
                            onChange={(e) => { setUserName(e.target.value) }} />
                        <button className="button full-width" onClick={() => {
                            if (userName.length) {
                                startSession(userName, Number(examId)).then((data) => {
                                    localStorage.setItem("currentSessionToken", data.sessionToken);
                                    navigate("/test/question");
                                }).catch((error) => {
                                    console.error("Помилка початку сесії:", error);
                                })
                            } else {
                                alert("Введіть ваше ім'я");
                            }
                        }}>
                            Кнопка почати
                        </button>
                    </>


                }
            </div>
        </div>
    )
}