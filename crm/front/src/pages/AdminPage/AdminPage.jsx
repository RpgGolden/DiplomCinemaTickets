import LeftMenu from "../../components/AdminPageComponents/LeftMenu/LeftMenu";
import Layout from "../../components/Layout/Layout";
import styles from "./AdminPage.module.scss"
import { Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";
import ImageModal from "../../components/PopUp/ImageModal/ImageModal";

function AdminPage({}) {
    const store = useSelector((state) => state);
    console.log("store", store)
    return (
        <div className={styles.AdminPage}>
            <LeftMenu/>
                <section className={styles.mainSection}>
                    <Outlet />
                </section>
            <ImageModal />
        </div>
    );
}

export default AdminPage;