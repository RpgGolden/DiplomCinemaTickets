import { useContext } from "react";
import DataContext from "../../context";
import Header from "../../components/Header/Header";
import Layout from "../../components/Layout/Layout";
import styles from "./HomePage.module.scss";
import SliderPromo from "../../components/SliderPromo/SliderPromo";
import FilmsProk from "../../modules/Films/FilmsProk";
function HomePage() {
    const context = useContext(DataContext);
    console.log("context", context)
    return ( 
       <main>
        <Header/>
        <Layout>
            <div className={styles.container}>
                <h1>HomePage</h1>
            </div>
            <div className={styles.sliderPromo}>
                <SliderPromo/>
            </div>
            <div className={styles.filmsProk}>
                <FilmsProk/>
            </div>
        </Layout>
       </main>
     );
}

export default HomePage;