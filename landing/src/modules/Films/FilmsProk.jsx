import CardFilms from "../../components/Film/CardFilms/CardFilms";
import styles from "./FilmsProk.module.scss";

function FilmsProk() {
    return ( 
        <div className={styles.filmsProk}>
            <div>
                <div className={styles.cardFilms}>
                    <CardFilms/>
                </div>
            </div>
        </div>
     );
}

export default FilmsProk;