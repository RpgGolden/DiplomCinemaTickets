import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import styles from "./Catalog.module.scss";
import Layout from "../../components/Layout/Layout";
import { Search } from "lucide-react";
import { testData } from "../../utils/testData";
import CardFilms from "../../components/CardFilms/CardFilms";
import { useEffect, useState } from "react";

function Catalog() {
    const [search, setSearch] = useState("");
    
    // Создаем несколько дубликатов массива testData
    const dublicateFilms = [testData]; // Добавлено для создания дубликатов
    const startData = testData
    const [films, setFilms] = useState(dublicateFilms);
    
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        if (search === "") {
            setFilms(startData);
        } else {
            const filteredFilms = (dublicateFilms.map((el) => {
                    return el.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
                })
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
                </div>
                <Layout>
                    <div className={styles.catalogSearch}>
                        <input type="text" placeholder="Поиск" onChange={handleSearch}/>
                        <Search />
                    </div>
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