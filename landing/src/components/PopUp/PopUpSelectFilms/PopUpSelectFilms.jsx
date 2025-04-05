import { useEffect } from "react";
import FilmBookings from "../../Film/FilmsBookings/FilmsBookings";
import SelectedFilmInfo from "../../Film/SelectedFilmInfo/SelectedFilmInfo";
import styles from "./PopUpSelectFilms.module.scss"

function PopUpSelectFilms(props) {
    useEffect(() => {
        console.log(props?.selectedFilm)
    },[props?.selectedFilm])
    return (
        <div class="modal" className={styles.PopUpSelectFilms} >
            <div>
             <img/>
                <h2>Фильм: {props?.selectedFilm?.title}</h2>
                {/* <p>Сеанс: {props?.selectedSession?.time}</p> */}
            </div>
            {/* <SelectedFilmInfo film={props?.selectedFilm.id}/> */}
            <FilmBookings/> 
            <button className={styles.buttonConfirm}>Подтвердить</button>
            <button className="close-button" onClick={() => props?.close()} >X</button>
        </div>
    );
}

export default PopUpSelectFilms;