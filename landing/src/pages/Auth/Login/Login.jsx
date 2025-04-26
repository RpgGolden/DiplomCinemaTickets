import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import styles from "./Login.module.scss";
import { useNavigate } from "react-router-dom";
import { apiLogin } from "../../../API/apiRequest";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = "Email обязателен";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Некорректный email";
        if (!password) newErrors.password = "Пароль обязателен";
        else if (password.length < 6) newErrors.password = "Пароль должен быть не менее 6 символов";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const data = {
                email: email,
                password: password
            }
            apiLogin(data).then((resp) => {
                if (resp?.status === 200) {
                    navigate("/HomePage");
                }else{
                    const newErrors = {password: 'Неправильный логин или пароль!'}
                    setErrors(newErrors)
                }
            })
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>Вход</h1>
                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="email"
                                type="email"
                                placeholder="Введите email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                style={errors.email ? { borderColor: "#c41212" } : {}}
                            />
                        </div>
                        {errors.email && <p className={styles.error}>{errors.email}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Пароль</label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="password"
                                type="password"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                style={errors.password ? { borderColor: "#c41212" } : {}}
                            />
                        </div>
                        {errors.password && <p className={styles.error}>{errors.password}</p>}
                    </div>
                    {/* <div className={styles.bottomRow}>
                        <a href="#" className={styles.forgotPassword}>Забыли пароль?</a>
                    </div> */}
                    <button type="submit" className={styles.loginButton} onClick={handleLogin}>
                        Войти
                    </button>
                    <div className={styles.cent}>
                        <p>Еще нет аккаунта? <span className={styles.forgotPassword} onClick={() => navigate('/register')}>Зарегистрироваться</span></p>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Login;
