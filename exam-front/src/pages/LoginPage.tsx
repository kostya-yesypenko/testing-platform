import { useState } from "react";
import { login } from "../services/LoginService";
import { useNavigate } from "react-router-dom";

export default () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<{ username?: string, password?: string }>({});
    const navigate = useNavigate();

    const validateFields = () => {
        const newErrors: { username?: string, password?: string } = {};

        if (username.trim().length < 3) {
            newErrors.username = "Ім'я користувача повинно містити щонайменше 3 символи";
        }

        if (password.length < 5) {
            newErrors.password = "Пароль має мати не менше 6 знаків";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    return (
        <div className="center-container">
            <div className="login-form-container">

                <h1 className="page-title">Зайти в обліковий запис</h1>

                <form>
                    <p>Ім’я користувача</p>
                    <input className="login-form-input" type="text" placeholder="Ваш логін"
                        value={username} onChange={(e) => setUsername(e.target.value)} />
                    <p className="error-text">{errors?.username}</p>

                    <p>Пароль</p>
                    <input className="login-form-input" type="password" placeholder="Ваш пароль"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p className="error-text">{errors?.password}</p>

                    <button className="login-form-button" type="submit"
                        onClick={(e) => {
                            e.preventDefault();

                            if (validateFields()) {
                                login({ username, password }).then(() => {
                                    navigate("/exams");
                                }).catch((error) => {
                                    console.error("Login failed", error);
                                    setErrors({ username: "Невірне ім’я користувача або пароль" });
                                });
                            }
                        }}>
                        Зайти в обліковий запис
                    </button>
                </form>
            </div>
        </div>
    );
};