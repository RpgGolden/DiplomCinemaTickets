import LeftMenu from "../../components/AdminPageComponents/LeftMenu/LeftMenu";
import Layout from "../../components/Layout/Layout";
import styles from "./AdminPage.module.scss";
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import ImageModal from "../../components/PopUp/ImageModal/ImageModal";
import { CircleUser } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { logout } from "../../API/apiRequest";
import { clearUserData } from "../../store/UserSlice/UserSlice";

function AdminPage() {
  const {userData} = useSelector((state) => state.UserSlice);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("userData", userData)
  // Закрытие при клике вне модалки
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);


    const logoutFunc = () =>{
        dispatch(clearUserData())
        logout();
        navigate("/")
    }
  return (
    <div className={styles.AdminPage}>
      <div className={styles.user}>
        <CircleUser
          size={28}
          onClick={() => setIsModalOpen((prev) => !prev)}
          className={styles.userIcon}
        />
        {isModalOpen && (
          <div ref={modalRef} className={styles.userModal}>
            <p>Добрый пожаловать, <strong>{userData.name} {userData.surname}</strong></p>
            <p>Ваша роль <strong>{userData.role}</strong></p>
            <button onClick={() => logoutFunc()}>Выйти</button>
          </div>
        )}
      </div>

      <LeftMenu />
      <section className={styles.mainSection}>
        <Outlet />
      </section>
      <ImageModal />
    </div>
  );
}

export default AdminPage;
