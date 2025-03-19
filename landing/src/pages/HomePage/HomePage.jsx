import { useContext } from "react";
import DataContext from "../../context";
import Header from "../../components/Header/Header";
import Layout from "../../components/Layout/Layout";
import styles from "./HomePage.module.scss";
import SliderPromo from "../../components/SliderPromo/SliderPromo";
import FilmsProk from "../../modules/Films/FilmsProk";
import Footer from "../../components/Footer/Footer";
import InfiniteSlider from "../../components/SliderAutho/InfiniteSlider";
import arrow from "./../../assets/img/green_triangle.svg";
function HomePage() {
    const context = useContext(DataContext);
    console.log("context", context)
    return ( 
       <main>
        <Header/>
        <SliderPromo/>

        <Layout>
            <div className={styles.container}>
                <div className={styles.sliderPromo}>
                </div>
                <div className={styles.filmsProk}>
                    <FilmsProk/>
                </div>
                <div className={styles.infiniteSlider}>
                    <h1 className={styles.title}>Наши партнеры</h1>
                    <InfiniteSlider/>
                </div>
            </div>
        </Layout>
                <div className={styles.soonFilms}>
                    <div className={styles.soonFilmsContainertitle}>
                        <h1 className={styles.soonFilmsTitle}>Скоро в кино</h1>
                        <img src={arrow} alt="arrow" />
                    </div>
                    <FilmsProk/>
                </div>
        
        <Footer/>
       </main>
     );
}

export default HomePage;