/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import SidebarNav from "../components/SidebarNav"
import { getSettings, updateSettings } from "../services/ExamService";
import { Settings } from "../types";
import { useNavigate } from "react-router-dom";

export default () => {
    const [settings, setSettings] = useState<Settings>({
        questionsOrder: undefined,
        timeLimit: 600,
        questionsPerSession: 10,
        startTime: new Date(),
        endTime: new Date(),
    });

    const navigate = useNavigate();

    const examId = localStorage.getItem("examId");
    useEffect(() => {
        getSettings(examId ?? "").then((_settings: Settings) => {
            setSettings(_settings);
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
                <h1 className="page-title">Налаштування</h1>
                <p className="field-title">Обмеження по часу в секундах</p>
                {<input type="number" className="text-input color-dark" placeholder="Обмеження в секундах" value={settings.timeLimit}
                    onChange={(e) => {
                        setSettings((prevSettings) => ({
                            ...prevSettings,
                            timeLimit: Number(e.target.value)
                        }))
                    }}
                />}

                <p className="field-title">Час початку</p>
                {<input type="datetime-local" className="text-input color-dark" value={settings.startTime ?
                    new Date(settings.startTime.getTime() - settings.startTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) :
                    ""}
                    onChange={(e) => {
                        console.log(e.target.value)
                        setSettings((prevSettings) => ({
                            ...prevSettings,
                            startTime: e.target.value ? new Date(e.target.value) : undefined
                        }))
                    }}
                />}

                <p className="field-title">Час завершення</p>
                {<input type="datetime-local" className="text-input color-dark" value={settings.endTime ?
                    new Date(settings.endTime.getTime() - settings.endTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) :
                    ""}
                    onChange={(e) => {
                        console.log(e.target.value)
                        setSettings((prevSettings) => ({
                            ...prevSettings,
                            endTime: e.target.value ? new Date(new Date(e.target.value).getTime()) : undefined
                        }))
                    }}
                />}

                <p className="field-title">Кількість питань кожному студенту</p>
                {<input type="number" className="text-input color-dark" placeholder="Кількість питань" value={settings.questionsPerSession}
                    onChange={(e) => {
                        setSettings((prevSettings) => ({
                            ...prevSettings,
                            questionsPerSession: Number(e.target.value)
                        }))
                    }}
                />}

                <p className="field-title">Порядок питань</p>
                <div>
                    <label>
                        <div>
                            <input type="radio" name="questionsOrder" value="inOrder" checked={settings.questionsOrder === "inOrder"}
                                onChange={() => {
                                    setSettings((prevSettings) => ({
                                        ...prevSettings,
                                        questionsOrder: "inOrder"
                                    }));
                                }} />
                            <span className="radio-title">По порядку</span>
                        </div>
                    </label>
                    <label>
                        <div>
                            <input type="radio" name="questionsOrder" value="random" checked={settings.questionsOrder === "random"}
                                onChange={() => {
                                    setSettings((prevSettings) => ({
                                        ...prevSettings,
                                        questionsOrder: "random"
                                    }));
                                }} />
                            <span className="radio-title">Випадковий</span>
                        </div>
                    </label>
                </div>

                <button className="button" type="submit" onClick={() => {
                    updateSettings(examId ?? "", settings);
                }}>
                    Зберегти
                </button>
            </div>
        </>
    )
}