import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import styles from "./Register.module.scss";
import { useNavigate } from "react-router-dom";
import { apiRegister } from "../../../API/apiRequest";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Имя обязательно";
        if (!form.email.trim()) newErrors.email = "Email обязателен";
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Некорректный email";
        if (!form.password) newErrors.password = "Пароль обязателен";
        else if (form.password.length < 6) newErrors.password = "Пароль должен быть не менее 6 символов";
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Пароли не совпадают";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const data = {
                name: form.name.split(" ")[1],
                surname: form.name.split(" ")[0],
                patronymic: form.name.split(" ")[2],
                email: form.email,
                password: form.password,
            }
            apiRegister(data).then((resp)=>{
                if(resp?.status === 200){
                    console.log(resp)
                    navigate("/")
                }
            })
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.registerBox}>
                <h1 className={styles.title}>Регистрация</h1>
                <form onSubmit={handleRegister} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>ФИО</label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Введите ФИО"
                                value={form.name}
                                onChange={handleChange}
                                className={styles.input}
                                style={errors.name ? { borderColor: "#c41212" } : {}}
                            />
                        </div>
                        {errors.name && <p className={styles.error}>{errors.name}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Введите email"
                                value={form.email}
                                onChange={handleChange}
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
                                name="password"
                                placeholder="Введите пароль"
                                value={form.password}
                                onChange={handleChange}
                                className={styles.input}
                                style={errors.password ? { borderColor: "#c41212" } : {}}
                            />
                        </div>
                        {errors.password && <p className={styles.error}>{errors.password}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>Повторите пароль</label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="Повторите пароль"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className={styles.input}
                                style={errors.confirmPassword ? { borderColor: "#c41212" } : {}}
                            />
                        </div>
                        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
                    </div>
                    <button type="submit" className={styles.registerButton}>
                        Зарегистрироваться
                    </button>
                    <div className={styles.cent}>
                        <p>Уже есть аккаунт? <span className={styles.forgotPassword} onClick={() => navigate('/login')}>Войти</span></p>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Register;
