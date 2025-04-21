import styles from "./TopMenu.module.scss"

function TopMenu({children}) {
    return (
        <div className={styles.TopMenu}>
            {children}
        </div>
    );
}

export default TopMenu;