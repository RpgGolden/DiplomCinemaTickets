import { DoorOpen, Instagram, Twitter, Facebook } from 'lucide-react';
import styles from './Header.module.scss';
import logo from './../../assets/img/logo.svg';
import { useNavigate } from 'react-router-dom';
function Header() {
    const navigate = useNavigate();
    return ( 
        <header className={styles.header}>
            <div className={styles.logo}>
                <img src={logo} alt="logo"/>
            </div>
            {/* <div className={styles.contacts}>
                <p>Пл. Мира, 12</p>
                <p>+7 (999) 999-99-99</p>
            </div> */}
            <nav className={styles.nav}>
                    <ul className={styles.list}>
                        <li onClick={() => navigate('/')}>Главная</li>
                        <li onClick={() => navigate('/catalog')}>Каталог</li>
                    </ul>
                </nav>
            <div className={styles.navButContainer}>
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
                <button className={styles.button} onClick={() => navigate('/login')}>  
                    <DoorOpen />Вход
                </button>
            </div>
            
        </header>
     );
}

export default Header;