import { useState } from "react";
import NewsCard from "../../components/NewsCard/NewsCard";
import { testData } from "../../utils/testData";
import styles from "./News.module.scss";
import { useEffect } from "react";
import { getAllNews } from "../../API/apiRequest";
import { useContext } from "react";
import DataContext from "../../context";

function News() {
    const {newsData} = useContext(DataContext)
    const [spliseDataNews, setSpliseDataNews] = useState([]);
    useEffect(() => {
        setSpliseDataNews(newsData.splice(0, 5))
    },[newsData])
    return ( 
        <div className={styles.News}>
            <div>
                <div className={styles.cardFilms}>
                   {spliseDataNews.map((item) => (
                        <NewsCard data={item} />
                   ))}
                </div>
            </div>
        </div>
     );
}

export default News;