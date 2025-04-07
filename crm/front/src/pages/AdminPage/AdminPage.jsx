import LeftMenu from "../../components/AdminPageComponents/LeftMenu/LeftMenu";
import Layout from "../../components/Layout/Layout";
import styles from "./AdminPage.module.scss"
import { Outlet } from 'react-router-dom';


function AdminPage({}) {
    return (
        <div className={styles.AdminPage}>
            <LeftMenu/>
                <section className={styles.mainSection}>
                    <input className={styles.inputSearch} placeholder="Search"/>
                    <Outlet />
                </section>
        </div>
    );
}

export default AdminPage;