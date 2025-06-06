/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTestResults, saveTestResult, deleteTestSession, getSession } from "../services/TestService";
import { Result } from "../types";

export default () => {
    const navigate = useNavigate();
    const [points, setPoints] = useState<number>(0);
    const [maxPoints, setMaxPoints] = useState<number>(0);
    const hasSaved = useRef<boolean>(false);
    const [isOver, setIsOver] = useState(false);


    useEffect(() => {
        const currentSessionToken = localStorage.getItem("currentSessionToken");
        if (!currentSessionToken) {
            navigate("/test/start");
            return;
        }

        const callback = async () => {
            try {
                const result: Result = await getTestResults(currentSessionToken);
                setPoints(result.points);
                setMaxPoints(result.maxPoints);

                const session = await getSession(currentSessionToken);
                const user = session.userName;
                const examId = session.examId;

                const updatedResult = {
                    ...result,
                    examId: examId,
                    user: user,
                    timeTaken: (Math.round(Date.now() - new Date(session.startTime).getTime()) / 1000),
                };

                if (!hasSaved.current) {
                    await saveTestResult(updatedResult);
                    hasSaved.current = true;
                }
            } catch (error) {
                console.error("Помилка отримання або збереження результату:", error);
            }
        };

        callback();

    }, [navigate]);

    const handleFinish = async () => {
        const currentSessionToken = localStorage.getItem("currentSessionToken");
        if (currentSessionToken) {
            try {
                await deleteTestSession(currentSessionToken);

                localStorage.removeItem("currentSessionToken");

                setIsOver(true);
            } catch (error) {
                console.error("Помилка видалення сесії:", error);
            }
        }
    };

    return (
        <div className="test-start-page center-container">
            <div className="test-container">
                {isOver ?
                    <p className="test-results-description">
                        Дякую за виконання тесту, можеш закрити вкладку.
                    </p> :
                    <>
                        <h1 className="page-title">Результати</h1>
                        <p className="test-results-description">
                            Ти виконав всі завдання. Твої показники {points} з {maxPoints}
                        </p>
                        <button className="finish-button" onClick={handleFinish}>
                            Завершити
                        </button>
                    </>
                }
            </div>
        </div>
    );
};
