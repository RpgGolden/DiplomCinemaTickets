import styles from "./CardFilms.module.scss";
import treangle from "./../../assets/img/view_trailer_icon.svg";

function CardFilms(props) {
    return ( 
        <div className={styles.cardFilms}>
           {props.data.map((item) => (
            <div key={item.id} className={styles.card}>
                <div className={styles.cardImage}>
                    <img src={item.image} alt={item.title} />
                    <button>Расписание и билеты</button>
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