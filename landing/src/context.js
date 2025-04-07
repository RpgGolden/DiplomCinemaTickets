import { createContext, useState } from "react";
import Modal from "react-modal";
import PopUpSelectFilms from "./components/PopUp/PopUpSelectFilms/PopUpSelectFilms";
import PopUpSelectNews from "./components/PopUp/PopUpSelectNews/PopUpSelectNews";
import { getOneMovie, getOneSession } from "./API/apiRequest";
import PopUpSucsess from "./components/PopUp/PopUpSucsess/PopUpSucsess";
import PopUpPromotions from "./components/PopUp/PopUpPromotions/PopUpPromotions";

Modal.setAppElement("#root");

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [viziblePopUp, setViziblePopUp] = useState("");
    const openModal = (film) => {
        getOneMovie(film.id).then((res) => {
            if(res.status === 200){
                setSelectedFilm(res.data);
                setModalIsOpen(true);
            }
        })
    };

    const openModalNews = (news) => {
        setSelectedNews(news);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedFilm(null);
        setSelectedNews(null);
        setViziblePopUp(null);
        setModalIsOpen(false);
    };

    const openModalPromotions = () => {
        setViziblePopUp("PopUpPromotions");
        setModalIsOpen(true);
    };

    const dataProviderData = {
        selectedFilm,
        openModal,
        openModalNews,
        closeModal,
        selectedNews,
        setSelectedNews,
        setSelectedSession,
        selectedSession,
        setViziblePopUp,
        viziblePopUp,
        openModalPromotions
    }
    const closePopUpSucsess = () => {
        setViziblePopUp(null)
        setModalIsOpen(false);
    }


    return (
        <DataContext.Provider value={dataProviderData}>
            {children}

            {/* Глобальное модальное окно */}
            <div className={`modal-overlay ${modalIsOpen ? "show" : ""}`} onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    {selectedFilm && <PopUpSelectFilms close={closeModal} selectedFilm={selectedFilm} setSelectedFilm={setSelectedFilm}  />}
                    {selectedNews && <PopUpSelectNews close={closeModal} selectedNews={selectedNews} />}
                    {viziblePopUp === "bookingConfirmed" && <PopUpSucsess closePopUpSucsess={closePopUpSucsess} />}
                    {viziblePopUp === "PopUpPromotions" && <PopUpPromotions close={closeModal}/>}
                </div>
            </div>
        </DataContext.Provider>
    );
};

export default DataContext;
