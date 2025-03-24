import styles from "./PopUpSelectNews.module.scss"

function PopUpSelectNews(props) {
    return (
        <div className={styles.PopUpSelectNews}>
            <h3>
                Ну вот новость
            </h3>
            <button className="close-button" onClick={() => props?.close()} >X</button>

        </div>
    );
}

export default PopUpSelectNews;