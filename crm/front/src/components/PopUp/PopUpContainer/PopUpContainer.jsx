import styles from "./PopUpContainer.module.scss"

function PopUpContainer({children, title}) {
    return (
        <div className={styles.PopUpContainer}>
            <div className={styles.PopUpContainerInner}> 
                {{children}}
            </div>
        </div>
    );
}

export default PopUpContainer;