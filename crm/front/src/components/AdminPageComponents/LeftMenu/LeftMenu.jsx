import { useEffect, useState } from "react";
import styles from "./LeftMenu.module.scss";
import {useNavigate} from "react-router-dom"
import { logout } from "../../../API/apiRequest";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../../store/UserSlice/UserSlice";
function LeftMenu() {
    const [currentPath, setCurrentPath] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dataMenu = [
        { id: 1, name: "Заявки", link: "/adminPage/request" },
        { id: 2, name: "Фильмы", link: "/adminPage/movies" },
        { id: 3, name: "Сеансы", link: "/adminPage/sessions"},
        { id: 4, name: "Залы", link: "/adminPage/halls"},
        { id: 5, name: "Акции", link: "/adminPage/promotions" },
        { id: 6, name: "Пользователи", link: "/adminPage/users" },
        { id: 7, name: "Новости", link: "/adminPage/news" },
        { id: 8, name: "Постеры", link: "/adminPage/posters" },
        { id: 9, name: "Бонусы пользователей", link: "/adminPage/bonuses" },
        { id: 10, name: "Категория мест", link: "/adminPage/categoryPlace" },
        // { id: 7, name: "Типы мест", link: "/adminPage/typePlace" },
    ];

    const goToLink = (link) =>{
        if(link){
            navigate(link)
            checkActiveMenu()
        }
    }
    useEffect(() => {
        checkActiveMenu()
    }, []);

    const checkActiveMenu = () =>{
        setCurrentPath(window.location.pathname);
    }

    const logoutFunc = () =>{
        dispatch(clearUserData())
        logout();
        navigate("/")
    }

    return (
        <div className={styles.LeftMenu}>
            <ul>
                {dataMenu.map(item => (
                    <li key={item.id} onClick={()=> goToLink(item.link)}   className={
                                currentPath === item.link
                                    ? styles.active
                                    : ""
                            }>
                        {item.name}
                    </li>
                ))}
                <li className={styles.logOut} onClick={() => logoutFunc()}>
                    Выйти
                </li>
            </ul>
        </div>
    );
}

export default LeftMenu;
