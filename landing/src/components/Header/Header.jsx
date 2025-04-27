import { DoorOpen, LogOut, CircleUser } from 'lucide-react';
import styles from './Header.module.scss';
import logo from './../../assets/img/logo.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { useContext, useEffect, useState } from 'react';
import DataContext from '../../context';
function Header() {
    const { isAuthenticated } = useAuth();
    const { openModalPromotions } = useContext(DataContext);
    const [userBonus, setUserBonus] = useState(0);

    useEffect(() => {
        const bonus = localStorage.getItem('userBonus');
        if (bonus) {
            setUserBonus(bonus);
        }
    }, []);

    const navigate = useNavigate();

    const clickBtn = ()=>{
        if(isAuthenticated){
            navigate('/profile');
        }else{
            navigate('/');
        }
    }

    const logout = () =>{
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        navigate('/');
    }
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
                        <li onClick={() => navigate('/HomePage')}>Главная</li>
                        <li onClick={() => navigate('/catalog')}>Каталог</li>
                        <li onClick={() => openModalPromotions()} >Акции</li>
                    </ul>
                </nav>
            <div className={styles.navButContainer}>
                {/* <div className={styles.social}>
                    <span className={styles.icon}>
                        <Instagram />
                    </span>
                    <span className={styles.icon}>
                        <Twitter />
                    </span>
                    <span className={styles.icon}>
                        <Facebook />
                    </span>
                </div> */}
                {/* <button className={styles.button} onClick={() => clickBtn()}>  
                    {isAuthenticated ? "Профиль" : <><DoorOpen />"Вход"</>}
                </button> */}
                <p>Бонусы: <span className={styles.colorBonuses}>{userBonus}</span></p>
                <CircleUser className={styles.headerIcon} onClick={() => clickBtn()}/>
                <LogOut className={styles.headerIcon} onClick={() => logout()}/>
            </div>
            
        </header>
     );
}

export default Header;