import { useEffect, useState } from "react";
import FilmBookings from "../../Film/FilmsBookings/FilmsBookings";
import styles from "./PopUpSelectFilms.module.scss";

function PopUpSelectFilms({ selectedFilm, close, setSelectedFilm }) {
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    console.log("selectedFilm", selectedFilm);
  }, [selectedFilm]);

  const handleSelectSession = (session) => {
    setSelectedSession(session);
  };

  const handleBackToSessions = () => {
    setSelectedSession(null);
  };

  return (
    <div className={styles.PopUpSelectFilms}>
      {/* Кнопка закрытия */}
      <button className={styles.closeButton} onClick={close}>
        X
      </button>

      {/* === ЭКРАН 1: информация о фильме и выбор сеанса === */}
      {!selectedSession && (
        <div className={styles.firstStep}>
          <div className={styles.filmInfoGrid}>
            <img
              src={selectedFilm?.imageUrls?.[0]}
              alt="Постер фильма"
              className={styles.poster}
            />

            <div className={styles.details}>
              <h2>Фильм: {selectedFilm?.title}</h2>
              <p>Возрастное ограничение: {selectedFilm?.ageRating}</p>
              <p>Режиссер: {selectedFilm?.director}</p>
              <p>Длительность: {selectedFilm?.duration} мин</p>
              <p>Описание: {selectedFilm?.description}</p>
              <h3>Выберите сеанс:</h3>
                {
                    selectedFilm?.sessions?.length > 0 ? (
                        <div>
                            <ul className={styles.sessionList}>
                                {selectedFilm.sessions.map((session) => (
                                    <li
                                        key={session.id}
                                        className={styles.sessionItem}
                                        onClick={() => handleSelectSession(session)}
                                    >
                                        {new Date(session.sessionTime).toLocaleString("ru-RU")} –{" "}
                                        {session.hall.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className={styles.noSeanses}>
                            <p>Извините, в настоящее время нет доступных сеансов</p>
                        </div>
                    )
                }
            </div>
        </div>
        </div>
      )}

      {/* === ЭКРАН 2: выбор мест === */}
      {selectedSession && (
        <div className={styles.secondStep}>
            <div className={styles.layout}>
                <div className={styles.sessionCard}>
                <h2>Выбранный сеанс</h2>
                <img
                    src={selectedFilm?.imageUrls?.[0]}
                    alt="Постер фильма"
                    className={styles.posterSelected}
                />
                <div className={styles.sessionInfoRow}>
                    <span className={styles.label}>🎬 Дата и время:</span>
                    <span>{new Date(selectedSession.sessionTime).toLocaleString("ru-RU")}</span>
                </div>
                <div className={styles.sessionInfoRow}>
                    <span className={styles.label}>🏢 Зал:</span>
                    <span>{selectedSession.hall.name}</span>
                </div>
                <div className={styles.sessionInfoRow}>
                    <span className={styles.label}>🪑 Мест в ряду:</span>
                    <span>{selectedSession.hall.seatCount}</span>
                </div>
                <div className={styles.sessionInfoRow}>
                    <span className={styles.label}>📏 Кол-во рядов:</span>
                    <span>{selectedSession.hall.rowCount}</span>
                </div>
                </div>

                <div className={styles.bookingArea}>
                <FilmBookings session={selectedSession} handleBackToSessions={handleBackToSessions} setSelectedFilm={setSelectedFilm}/>
                </div>
            </div>
            </div>


      )}
    </div>
  );
}

export default PopUpSelectFilms;
