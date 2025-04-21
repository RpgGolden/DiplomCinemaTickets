import PopUpContainer from "../PopUpContainer/PopUpContainer";
import styles from "./PopUpCreateMovie.module.scss"

function PopUpCreateMovie() {
    return (
        <PopUpContainer>
            <div className={styles.PopUpCreateMovie}>
                Вот это PopUp
            </div>
        </PopUpContainer>
        
    );
}

export default PopUpCreateMovie;