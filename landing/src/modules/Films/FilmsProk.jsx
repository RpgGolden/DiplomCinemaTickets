import CardFilms from "../../components/CardFilms/CardFilms";
import { testData } from "../../utils/testData";
import styles from "./FilmsProk.module.scss";

function FilmsProk() {
   
    return ( 
        <div className={styles.filmsProk}>
            <div>
                <h1 className={styles.title}>Фильмы в прокате</h1>
                <div className={styles.cardFilms}>
                    <CardFilms data={testData} />
                </div>
            </div>
        </div>
     );
}

export default FilmsProk;