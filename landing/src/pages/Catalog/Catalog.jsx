import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import styles from "./Catalog.module.scss";
import Layout from "../../components/Layout/Layout";
import { Search } from "lucide-react";
import { testData } from "../../utils/testData";
import { useEffect, useState } from "react";
import CardFilms from "../../components/Film/CardFilms/CardFilms";

function Catalog() {
    const [search, setSearch] = useState("");
    
    // Создаем копию testData без вложенных массивов
    const startData = [...testData]; 
    const [films, setFilms] = useState(startData);
    
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        if (search.trim() === "") {
            setFilms(startData);
        } else {
            const filteredFilms = startData.filter((item) => 
                item.title.toLowerCase().includes(search.toLowerCase())
            );
            setFilms(filteredFilms);
        }
    }, [search]);

    return ( 
        <main className={styles.catalog}>
            <Header/>
            <div className={styles.catalogContainer}>
                <div className={styles.catalogHeader}>
                    <h1>Каталог</h1>
                    <div className={styles.catalogSearch}>
                        <input 
                            type="text" 
                            placeholder="Поиск" 
                            value={search} 
                            onChange={handleSearch}
                        />
                        <Search />
                    </div>
                </div>
                <Layout>
                   
                    <div className={styles.catalogFilms}>
                        <CardFilms data={films} />
                    </div>
                </Layout>
            </div>
            <Footer/>
        </main>
    );
}

export default Catalog;
