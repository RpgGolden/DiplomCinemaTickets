import { useContext } from "react";
import DataContext from "../../context";
import Header from "../../components/Header/Header";
import Layout from "../../components/Layout/Layout";
import styles from "./HomePage.module.scss";
import SliderPromo from "../../components/SliderPromo/SliderPromo";
import FilmsProk from "../../modules/Films/FilmsProk";
import Footer from "../../components/Footer/Footer";
import InfiniteSlider from "../../components/SliderAutho/InfiniteSlider";
function HomePage() {
    const context = useContext(DataContext);
    console.log("context", context)
    return ( 
       <main>
        <Header/>
        <Layout>
            <div className={styles.container}>
                <div className={styles.sliderPromo}>
                    <h1 className={styles.title}>Акции</h1>
                    <SliderPromo/>
                </div>
                <div className={styles.filmsProk}>
                    <h1 className={styles.с}>Фильмы в прокате</h1>
                    <FilmsProk/>
                </div>
                <div className={styles.infiniteSlider}>
                    <h1 className={styles.title}>Наши партнеры</h1>
                    <InfiniteSlider/>
                </div>
            </div>
        </Layout>
        <Footer/>
       </main>
     );
}

export default HomePage;