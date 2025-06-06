import SidebarNav from "../components/SidebarNav"

const urlBase = "localhost:5173";
const getLink = (examId: string) => {
    return `${urlBase}/test/start?examId=${examId}`;
}

export default () => {
    const examId = localStorage.getItem("examId");

    return (
        <>
            <SidebarNav />
            <div className="page-container">
                <h1 className="page-title">Отримати посилання</h1>
                <p className="exam-description">Натисніть, щоб скопіювати посилання</p>
                <button onClick={() => {
                    navigator.clipboard.writeText(getLink(examId ?? ""))
                        .then(() => alert("Посилання скопійовано до буфера обміну"))
                        .catch(err => console.error("Не вдалося скопіювати посилання: ", err));
                }}>{getLink(examId ?? "")}</button>
            </div >
        </>
    )
}
