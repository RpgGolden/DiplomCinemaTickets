import styles from "./PopUpPromotions.module.scss"

function PopUpPromotions(props) {
    return (
        <div className={styles.PopUpPromotions}>
            PopUpPromotions
            <button className="close-button" onClick={() => props?.close()} >X</button>
        </div>
    );
}

export default PopUpPromotions;