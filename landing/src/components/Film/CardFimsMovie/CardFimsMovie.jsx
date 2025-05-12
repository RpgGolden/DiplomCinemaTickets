import { useContext, useEffect, useState } from "react";
import styles from "./CardFimsMovie.module.scss"
import DataContext from "../../../context";
import treangle from "./../../../assets/img/view_trailer_icon.svg";

function CardFimsMovie(props) {
    const { openModal } = useContext(DataContext);
    return (
        <div className={styles.CardFimsMovie}>
            {props?.data?.map((item) => (
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

export default CardFimsMovie;