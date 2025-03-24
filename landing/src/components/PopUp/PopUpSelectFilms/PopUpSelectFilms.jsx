import styles from "./PopUpSelectFilms.module.scss"

function PopUpSelectFilms(props) {
    return (
        <div className="modal">
            <h2>{props?.selectedFilm?.title}</h2>
            <p>Здесь будет расписание и билеты для фильма.</p>
            <button className="close-button" onClick={() => props?.close()} >X</button>
        </div>
    );
}

export default PopUpSelectFilms;