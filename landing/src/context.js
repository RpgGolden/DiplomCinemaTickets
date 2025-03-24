import { createContext, useState } from "react";
import Modal from "react-modal";
import PopUpSelectFilms from "./components/PopUp/PopUpSelectFilms/PopUpSelectFilms";
import PopUpSelectNews from "./components/PopUp/PopUpSelectNews/PopUpSelectNews";

Modal.setAppElement("#root");

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const openModal = (film) => {
        setSelectedFilm(film);
        setModalIsOpen(true);
    };

    const openModalNews = (news) => {
        setSelectedNews(news);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedFilm(null);
        setSelectedNews(null);
        setModalIsOpen(false);
    };

    return (
        <DataContext.Provider value={{ selectedFilm, openModal, openModalNews, closeModal, setSelectedNews }}>
            {children}

            {/* Глобальное модальное окно */}
            <div className={`modal-overlay ${modalIsOpen ? "show" : ""}`} onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    {selectedFilm && <PopUpSelectFilms close={closeModal} selectedFilm={selectedFilm} />}
                    {selectedNews && <PopUpSelectNews close={closeModal} selectedNews={selectedNews} />}
                </div>
            </div>
        </DataContext.Provider>
    );
};

export default DataContext;
