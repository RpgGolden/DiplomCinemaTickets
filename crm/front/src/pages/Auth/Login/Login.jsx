import { useState } from "react";
import styles from "./Login.module.scss";
import { apiLogin } from "../../../API/apiRequest";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../store/UserSlice/UserSlice";

function Login() {
    const [datalogin, setDatalogin] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const navigate = useNavigate();
    const validate = () => {
        const newErrors = {};
        const emailRegex = /\S+@\S+\.\S+/;

        if (!datalogin.email.trim()) {
            newErrors.email = "Логин обязателен";
        } else if (datalogin.email.includes("@") && !emailRegex.test(datalogin.email)) {
            newErrors.email = "Некорректный email";
        }

        if (!datalogin.password) {
            newErrors.password = "Пароль обязателен";
        } else if (datalogin.password.length < 6) {
            newErrors.password = "Минимум 6 символов";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        setGeneralError("");

        if (validate()) {
            // Пример запроса
            apiLogin(datalogin).then(res => {
                if (res.status === 200) {
                    dispatch(setUserData(res.data))
                    navigate('/adminPage/request')
                } else {
                    setGeneralError("Неверный логин или пароль");
                }
            });
        }
    };

    return (
        <div className={styles.Login}>
            <form className={styles.card} onSubmit={handleSubmit}>
                <div className={styles.headerFormTile}>
                    <h2 className={styles.title}>Авторизация</h2>
                </div>

                <div className={styles.inputContainer}>
                    <label>Логин</label>
                    <input
                        type="text"
                        placeholder="Введите email или логин"
                        value={datalogin.email}
                        onChange={(e) => setDatalogin({ ...datalogin, email: e.target.value })}
                        style={errors.email ? { borderColor: "#c41212" } : {}}
                    />
                    {errors.email && <p className={styles.error}>{errors.email}</p>}
                </div>

                <div className={styles.inputContainer}>
                    <label>Пароль</label>
                    <input
                        type="password"
                        placeholder="Введите пароль"
                        value={datalogin.password}
                        onChange={(e) => setDatalogin({ ...datalogin, password: e.target.value })}
                        style={errors.password ? { borderColor: "#c41212" } : {}}
                    />
                    {errors.password && <p className={styles.error}>{errors.password}</p>}
                </div>

                <div className={styles.actions}>
                    <label className={styles.checkbox}>
                        <input type="checkbox" />
                        <span>Запомнить меня</span>
                    </label>
                </div>

                {generalError && <p className={styles.generalError}>{generalError}</p>}

                <button className={styles.button} type="submit">Войти</button>
            </form>
        </div>
    );
}

export default Login;
