import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UniversalTable from "../../../components/UniversalTable/UniversalTable";
import { movieColumns } from "../../../utils/ColumnsTable";
import { getandSetMovieData, setMovieData } from "../../../store/MoviesSlice/MoviesSlice";
import MovieDialog from "../../../components/PopUp/Dialog/MovieDialog";  // Модальное окно для фильмов
import TopMenu from "../../../components/AdminPageComponents/TopMenu/TopMenu";
import styles from "./Movies.module.scss";
import { addMovie, deleteMovie, updateMovie } from "../../../API/apiRequest";

function Movies() {
  const dispatch = useDispatch();
  const { MovieData } = useSelector((state) => state.MoviesSlice);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
      dispatch(getandSetMovieData((data) => dispatch(setMovieData(data))));
  }, [dispatch]);

  // Открытие модалки для добавления/редактирования фильма
  const handleOpenDialog = (movie = null) => {
    setSelectedMovie(movie);
    setOpenDialog(true);
  };

  // Закрытие модалки
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMovie(null);
  };

  // Сохранение нового или обновленного фильма
  const handleSaveMovie = (formDataWithFiles) => {
    const movie = formDataWithFiles;
    if (movie.get("id")) {
      // Обновление фильма
      updateMovie(movie.get("id"), movie).then((resp) => {
        if (resp?.status === 200) {
          dispatch(getandSetMovieData((data) => dispatch(setMovieData(data))));
        }
      });
    } else {
      // Добавление нового фильма
      addMovie(movie).then((resp) => {
        if (resp?.status === 200) {
          dispatch(getandSetMovieData((data) => dispatch(setMovieData(data))));
        }
      });
    }
  };

  // Удаление фильма
  const handleDeleteMovie = (movieId) => {
    deleteMovie(movieId).then((resp) => {
      if (resp?.status === 200) {
        dispatch(getandSetMovieData((data) => dispatch(setMovieData(data))));
      }
    });
  };

  return (
    <div className={styles.Movies}>
      <div className={styles.MoviesTable}>
        <UniversalTable
          columns={movieColumns}
          data={MovieData}
          onAdd={() => handleOpenDialog()}  // Открытие модалки для добавления
          onEdit={handleOpenDialog}  // Открытие модалки для редактирования
          onDelete={handleDeleteMovie}  // Удаление фильма
          editingMode={true}
          addMode={true} // Разрешаем добавление
        />
      </div>

      {/* Модальное окно для добавления/редактирования фильма */}
      <MovieDialog
        open={openDialog}
        onClose={handleCloseDialog}
        movieData={selectedMovie}
        onSave={handleSaveMovie}
        onDelete={handleDeleteMovie}
      />
    </div>
  );
}

export default Movies;
