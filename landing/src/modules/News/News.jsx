import NewsCard from "../../components/NewsCard/NewsCard";
import { testData } from "../../utils/testData";
import styles from "./News.module.scss";

function News() {
   
    return ( 
        <div className={styles.News}>
            <div>
                <div className={styles.cardFilms}>
                   {testData.map((item) => (
                    <NewsCard data={item} />
                   ))}
                </div>
            </div>
        </div>
     );
}

export default News;