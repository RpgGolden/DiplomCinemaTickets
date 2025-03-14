import styles from "./CardFilms.module.scss";

function CardFilms(props) {
    return ( 
        <div className={styles.cardFilms}>
           {props.data.map((item) => (
            <div key={item.id} className={styles.card}>
                <img src={item.image} alt={item.title} />
                <div className={styles.cardContent}>
                    <h1>{item.title}</h1>
                    <p>{item.description}</p>
                </div>
            </div>
           ))}
        </div>
     );
}

export default CardFilms;