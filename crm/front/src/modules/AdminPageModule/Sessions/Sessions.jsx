import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UniversalTable from "../../../components/UniversalTable/UniversalTable";
import { sessionColumns } from "../../../utils/ColumnsTable";
import {
  getAndSetSessionData,
  setSessionData,
} from "../../../store/SessionsSlice/SessionsSlice";
import SessionDialog from "../../../components/PopUp/Dialog/SessionDialog";
import styles from "./Sessions.module.scss";
import {
  createSession,
  deleteSession,
  updateSession,
} from "../../../API/apiRequest";
import { getandSetHallData, setHallData } from "../../../store/HallsSlice/HallsSlice";
import { getandSetMovieData, setMovieData } from "../../../store/MoviesSlice/MoviesSlice";

function Sessions() {
  const dispatch = useDispatch();
  const { sessionData } = useSelector((state) => state.SessionsSlice);
  const { MovieData } = useSelector((state) => state.MoviesSlice);
  const { HallData } = useSelector((state) => state.HallsSlice);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [moviesData, setMoviesData] = useState([]);
  const [hallsData, setHallsData] = useState([]);

  useEffect(() => {
    // Получаем данные о сессиях
        dispatch(getAndSetSessionData((data) => dispatch(setSessionData(data))));
    // Получаем и устанавливаем фильмы
    if (MovieData?.length === 0 || !MovieData) {
      dispatch(getandSetMovieData((data) => {
        console.log("getandSetMovieData", data)
        dispatch(setMovieData(data));
        setMoviesData(data);
      }));
    } else {
      setMoviesData(MovieData);
    }

    // Получаем и устанавливаем залы
    if (HallData?.length === 0 || !HallData) {
      dispatch(getandSetHallData((data) => {
        console.log("getandSetHallData", data)
        dispatch(setHallData(data));
        setHallsData(data); 
      }));
    } else {
      setHallsData(HallData); 
    }
  }, [dispatch]);

  const handleOpenDialog = (session = null) => {
    setSelectedSession(session);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSession(null);
  };

  const handleSaveSession = (formData) => {
    const id = formData?.id;
    if (id) {
      // Обновляем существующий сеанс
      updateSession(id, formData).then((resp) => {
        if (resp?.status === 200) {
          dispatch(getAndSetSessionData((data) => dispatch(setSessionData(data))));
        }
      }); 
    } else {
      // Создаем новый сеанс
      const data = {
        name: formData.name,
        hallId: formData.hallId,
        movieId: formData.movieId,
        sessionTime: formData.startTime,
        price: formData.price
      }
      createSession(data).then((resp) => {
        if (resp?.status === 200) {
          dispatch(getAndSetSessionData((data) => dispatch(setSessionData(data))));
        }
      });
    }
  };

  const handleDeleteSession = (sessionId) => {
    deleteSession(sessionId).then((resp) => {
      if (resp?.status === 200) {
        dispatch(getAndSetSessionData((data) => dispatch(setSessionData(data))));
      }
    });
  };


  return (
    <div className={styles.Sessions}>
      <div className={styles.SessionsTable}>
        <UniversalTable
          columns={sessionColumns}
          data={sessionData}
          onAdd={() => handleOpenDialog()}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteSession}
          editingMode={false}
          addMode={true} // Разрешаем добавление
        />
      </div>

      <SessionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        sessionData={selectedSession}
        onSave={handleSaveSession}
        onDelete={handleDeleteSession}
        movies={moviesData}
        halls={hallsData}
      />
    </div>
  );
}

export default Sessions;
