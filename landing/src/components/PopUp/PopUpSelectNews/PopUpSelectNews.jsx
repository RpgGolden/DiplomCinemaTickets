import { useContext } from "react";
import DataContext from "../../../context";
import styles from "./PopUpSelectNews.module.scss"

function PopUpSelectNews(props) {
    const {selectedNews} = useContext(DataContext);
    return (
        <div className={styles.PopUpSelectNews}>
            <div className={styles.PopUpSelectNewsContainer}>
                <div className={styles.PopUpSelectNewsImg}>
                    <img src={selectedNews?.imageUrl} className="image"/>    
                </div>
                <div className={styles.PopUpSelectNewsText}>
                    <h4 className={styles.promotionTitle}>{selectedNews.title}</h4>
                    <p className={styles.promotionDescription}>{selectedNews.content}</p>
                </div>
            </div>
            <button className="close-button" onClick={() => props?.close()} >X</button>
        </div>
    );
}

export default PopUpSelectNews;