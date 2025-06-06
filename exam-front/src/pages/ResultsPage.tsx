/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarNav from "../components/SidebarNav"
import { getResults } from "../services/ExamService";
import { Result } from "../types";

export default () => {
    const [results, setResults] = useState<Result[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const examId = localStorage.getItem("examId");

        getResults(examId ?? "").then((_results: Result[]) => {
            setResults(_results);
        }).catch((error) => {
            console.error("Error fetching questions:", error);
            if (error.code === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        })
    }, []);

    return (
        <>
            <SidebarNav />
            <div className="page-container">
                <h1 className="page-title">Результати</h1>
                <div className="table" >
                    <div className="table-row-header" >
                        <div className="table-cell w-[20px]">
                            #
                        </div>
                        <div className="table-cell w-[350px]">
                            Користувач
                        </div>
                        <div className="table-cell w-[170px]">
                            Кількість балів
                        </div>

                        <div className="table-cell">
                            Час виконаня
                        </div>
                    </div >
                    {results.map((result, index) => {
                        return (
                            <div className="table-row" >
                                <div className="flex ml-[8px]">
                                    <div className="table-cell w-[20px]">
                                        {index + 1}
                                    </div>
                                    <div className="table-cell w-[350px]">
                                        {result.user}
                                    </div>
                                    <div className="table-cell w-[170px]">
                                        {result.points} з {result.maxPoints}
                                    </div>
                                    
                                    <div className="table-cell">
                                        {(Math.floor(result.timeTaken / 60))} хв. {Math.floor(result.timeTaken % 60)} сек.
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <button className="button" onClick={() => {
                    const element = document.createElement("a");
                    const csvContent = results.map(r =>
                        `${r.user} отримав ${r.points} з ${r.maxPoints} за ${Math.floor(r.timeTaken / 60)} хв. ${Math.floor(r.timeTaken % 60)} сек.`
                    ).join("\n");
                    const file = new Blob([csvContent], { type: 'text/plain' });
                    element.href = URL.createObjectURL(file);
                    element.download = "Результати";
                    document.body.appendChild(element);
                    element.click();
                }}>
                    Кнопка експорт
                </button>
            </div >
        </>
    )
}
