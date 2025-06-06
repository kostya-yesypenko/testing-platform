import { useEffect, useState } from "react";
import SidebarNav from "../components/SidebarNav";
import { getExamData, updateExamData } from "../services/ExamService";
import { useLocation, useNavigate } from "react-router-dom";

export default () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [errors, setErrors] = useState<{ title?: string }>({});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const examId = queryParams.get("examId");
        if (examId)
            localStorage.setItem("examId", examId ?? "");

        getExamData(localStorage.getItem("examId") ?? "").then(({ title: _title, description: _description }) => {
            setTitle(_title);
            setDescription(_description);
        }).catch((error) => {
            console.error("Error fetching questions:", error);
            if (error.code === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        });
    }, [navigate, location.search]);

    const handleSave = async (event: React.MouseEvent) => {
        event.preventDefault();
        setErrors({});
        if (!title) {
            setErrors({ title: "Введіть назву тесту" });
            return;
        }

        const examId = localStorage.getItem("examId") || "";
        try {
            await updateExamData(examId, { title, description });
            alert("Дані успішно збережені");
        } catch (error) {
            console.error("Помилка оновлення даних екзамену:", error);
            alert("Не вдалося зберегти зміни");
        }
    }

    return (
        <>
            <SidebarNav />
            <div className="page-container">
                <h1 className="page-title">Головна</h1>
                <p className="field-title">Назва</p>
                <input className="text-input color-dark" placeholder="Назва тесту"
                    value={title} onChange={(event) => setTitle(event.target.value)} />
                <p className="error-text">{errors?.title}</p>
                <p className="field-title">Опис</p>
                <textarea className="text-area" placeholder="Назва тесту" cols={36} rows={8}
                    value={description} onChange={(event) => setDescription(event.target.value)} />
                <div>
                    <button className="button" type="submit" onClick={handleSave}>
                        Зберегти
                    </button>
                </div>
            </div>
        </>
    );
};