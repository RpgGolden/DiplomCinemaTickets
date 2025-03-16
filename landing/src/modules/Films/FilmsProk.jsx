import CardFilms from "../../components/CardFilms/CardFilms";
import { testData } from "../../utils/testData";
import styles from "./FilmsProk.module.scss";

function FilmsProk() {
   
    return ( 
        <div className={styles.filmsProk}>
            <div>
                <div className={styles.cardFilms}>
                    <CardFilms data={testData} />
                </div>
            </div>
        </div>
     );
}

export default FilmsProk;