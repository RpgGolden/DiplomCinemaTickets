import styles from "./NewsCard.module.scss";

function NewsCard(props) {
    console.log(props.data)
    return ( 
        <div className={styles.newsCard}>
            <div className={styles.newsCardImage}>
                <img src={props.data.image} alt="news" />
                <div className={styles.newsCardContent}>
                    <h3>{props.data.title}</h3>
                    <button>Подробнее</button>
                </div>
            </div>
        </div>
     );
}

export default NewsCard;