import { useContext } from "react";
import styles from "./PopUpSucsess.module.scss"
import DataContext from "../../../context";

function PopUpSucsess({closePopUpSucsess}) {
    return (
        <div className={styles.PopUpSucsess}>
            <p>Сеанс успешно забронирован, билеты отправлены на почту!</p>
            <button onClick={() => closePopUpSucsess()}>Закрыть</button>
        </div>
    );
}

export default PopUpSucsess;