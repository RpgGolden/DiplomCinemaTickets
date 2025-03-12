import { DoorOpen, Instagram, Twitter, Facebook } from 'lucide-react';
import styles from './Header.module.scss';

function Header() {
    return ( 
        <header className={styles.header}>
            <h1>Header</h1>
            <nav className={styles.nav}>
                <ul className={styles.list}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </nav>
            <div className={styles.social}>
                <span className={styles.icon}>
                    <Instagram />
                </span>
                <span className={styles.icon}>
                    <Twitter />
                </span>
                <span className={styles.icon}>
                    <Facebook />
                </span>
            </div>
            <button className={styles.button}><DoorOpen />Вход</button>
        </header>
     );
}

export default Header;