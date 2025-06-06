import { Link } from "react-router-dom"

export default () => {
    return (
        <div className="sidebar-nav">
            <div className="sidebar-nav-header">
                <div className="sidebar-nav-item">
                    <Link to="/exams" className="sidebar-nav-link">Усі контрольні</Link>
                </div>
                <div className="sidebar-nav-item">
                    <Link to="/start" className="sidebar-nav-link">Головна</Link>
                </div>
                <div className="sidebar-nav-item">
                    <Link to="/questions" className="sidebar-nav-link">Питання</Link>
                </div>
                <div className="sidebar-nav-item">
                    <Link to="/results" className="sidebar-nav-link">Показники</Link>
                </div>
                <div className="sidebar-nav-item">
                    <Link to="/settings" className="sidebar-nav-link">Налаштування</Link>
                </div>
                <div className="sidebar-nav-item">
                    <Link to="/getLink" className="sidebar-nav-link">Посилання</Link>
                </div>
            </div>
            <div>
                <button className="sidebar-nav-item" onClick={() => {
                    console.log("Logout");
                    localStorage.removeItem("token");
                }}>
                    <Link to="/login" className="sidebar-nav-link">Вийти</Link>
                </button>
            </div>
        </div>
    )
}