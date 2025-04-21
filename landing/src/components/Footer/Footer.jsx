import styles from "./Footer.module.scss";
import logo from "./../../assets/img/logoVert.svg";
import { Instagram, Twitter, Facebook } from "lucide-react";
function Footer() {
    return ( 
        <footer>
            <div className={styles.container}>
                <img src={logo} alt="logo"/>
                <div className={styles.contacts}> 
                    <p><a href="https://goo.gl/maps/1234567890" target="_blank" rel="noopener noreferrer">Пл. Мира, 12</a></p>
                    <p><a href="tel:+79999999999" target="_blank" rel="noopener noreferrer">+7 (999) 999-99-99</a></p>
                    <div className={styles.socialItem}>
                        <Instagram/>
                        <Twitter/>
                        <Facebook/>
                    </div>
                </div>
                <div className={styles.social}>
                   
                    <div className={styles.time}>
                        <p>Время работы</p>
                        <p>Пн-Пт: 10:00-18:00</p>
                        <p>Сб-Вс: 10:00-16:00</p>
                    </div>
                </div>
            </div>
        </footer>
     );
}

export default Footer;