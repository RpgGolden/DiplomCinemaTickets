import { useContext } from "react";
import DataContext from "../../context";
import styles from "./CardFilms.module.scss";
import treangle from "./../../assets/img/view_trailer_icon.svg";

function CardFilms({ data }) {
    const { openModal } = useContext(DataContext);

    return (
        <div className={styles.cardFilms}>
            {data.map((item) => (
                <div key={item.id} className={styles.card}>
                    <div className={styles.cardImage}>
                        <img src={item.image} alt={item.title} />
                        <button onClick={() => openModal(item)}>Расписание и билеты</button>
                    </div>
                    <div className={styles.cardContent}>
                        <h1>{item.title}</h1>
                        <img src={treangle} alt="treangle" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CardFilms;
