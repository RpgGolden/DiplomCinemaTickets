import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import styles from "./Catalog.module.scss";
import Layout from "../../components/Layout/Layout";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import CardFilms from "../../components/Film/CardFilms/CardFilms";
import { getAllMovies } from "../../API/apiRequest";
import CardFimsMovie from "../../components/Film/CardFimsMovie/CardFimsMovie";
import { genres } from "./../../utils/enums";

function Catalog() {
    const [search, setSearch] = useState("");
    const [films, setFilms] = useState([]);
    const [filteredFilms, setFilteredFilms] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    
    // Fetch movies from the API
    useEffect(() => {
        getAllMovies().then((resp) => {
            if (resp && resp.data) {
                setFilms(resp.data);
                setFilteredFilms(resp.data);
            }
        });
    }, []);
    
    // Filter films based on search input and genres
    useEffect(() => {
        let result = films;

        // Apply search filter
        if (search.trim() !== '') {
            result = result.filter(item =>
                Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(search.toLowerCase()),
                ),
            );
        }

        // Apply genre filter if any genres are selected
        if (selectedGenres.length > 0) {
            result = result.filter(item => {
                if (!item.genres || item.genres.length === 0) return false;
                
                // Check if film has any of selected genres
                return item.genres.some(genre => 
                    selectedGenres.includes(genre) || 
                    selectedGenres.some(selected => genres[selected] === genre)
                );
            });
        }

        setFilteredFilms(result);
    }, [search, films, selectedGenres]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const toggleGenre = (genreKey) => {
        setSelectedGenres(prev => 
            prev.includes(genreKey) 
                ? prev.filter(g => g !== genreKey) 
                : [...prev, genreKey]
        );
    };

    return ( 
        <main className={styles.catalog}>
            <Header/>
            <div className={styles.catalogContainer}>
                <div className={styles.catalogHeader}>
                    <div className={styles.catalogSearch}>
                        <input 
                            type="text" 
                            placeholder="Поиск по названию" 
                            value={search} 
                            onChange={handleSearch}
                        />
                        <Search className={styles.searchIcon} />
                    </div>
                    
                    <div className={styles.genreButtons}>
                        <div className={styles.buttonsContainer}>
                            {Object.entries(genres).map(([key, label]) => (
                                <button
                                    key={key}
                                    className={`${styles.genreButton} ${
                                        selectedGenres.includes(key) ? styles.active : ""
                                    }`}
                                    onClick={() => toggleGenre(key)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <Layout>
                    <div className={styles.catalogFilms}>
                        {filteredFilms.length > 0 ? (
                            <CardFimsMovie data={filteredFilms} />
                        ) : (
                            <div className={styles.noResults}>
                                Ничего не найдено. Попробуйте изменить параметры поиска.
                            </div>
                        )}
                    </div>
                </Layout>
            </div>
            <Footer/>
        </main>
    );
}

export default Catalog;