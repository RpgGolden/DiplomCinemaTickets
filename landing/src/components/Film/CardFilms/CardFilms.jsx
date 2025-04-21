import { useContext, useEffect, useState } from "react";
import { getAllMovies } from "../../../API/apiRequest";
import DataContext from "../../../context";
import styles from "./CardFilms.module.scss";
import treangle from "./../../../assets/img/view_trailer_icon.svg";
function CardFilms() {
    const { openModal } = useContext(DataContext);
    const [dataFilms, setDataFilms] = useState([]);
    useEffect(() => {
        getAllMovies().then((res) => {
                console.log('res.data',res)
                setDataFilms(res.data)
        })
    },[])

    return (
        <div className={styles.cardFilms}>
            {dataFilms?.map((item) => (
                <div key={item.id} className={styles.card}>
                    <div className={styles.cardImage}>
                    {item.imageUrls && item.imageUrls.length > 0 ? 
                    <>
                        <img src={item.imageUrls[0]} alt={item.title}/>
                    </>
                        :
                    <>
                        <img src="/img/noPhoto.png" alt={item.title} />
                    </>
                    }

                        <button onClick={() => openModal(item)}>Расписание и билеты</button>
                    </div>
                    <div className={styles.cardContent}>
                        <h1>{item?.title}</h1>
                        <img src={treangle} alt="treangle" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CardFilms;
