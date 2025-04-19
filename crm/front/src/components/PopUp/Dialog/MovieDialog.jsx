import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const MovieDialog = ({ open, onClose, movieData, onSave, onDelete }) => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (movieData) {
      setFormData({
        ...movieData,
        genres: Array.isArray(movieData.genres) ? movieData.genres.join(", ") : movieData.genres || "",
        actors: Array.isArray(movieData.actors) ? movieData.actors.join(", ") : movieData.actors || "",
      });
    } else {
      setFormData({});
    }
    setFiles([]);
    setErrors({});
  }, [movieData]);

  const validateFields = (data = formData) => {
    const newErrors = {};
    if (!String(data.title).trim()) newErrors.title = "Название обязательно.";
    if (!String(data.director).trim()) newErrors.director = "Режиссер обязателен.";
    if (!String(data.description).trim()) newErrors.description = "Описание обязательно.";
    if (!String(data.genres).trim()) newErrors.genres = "Жанры обязательны.";
    if (!String(data.actors).trim()) newErrors.actors = "Актеры обязательны.";
    if (!String(data.releaseDate).trim()) newErrors.releaseDate = "Дата релиза обязательна.";
    if (!String(data.ageRating).trim()) newErrors.ageRating = "Возрастной рейтинг обязателен.";
    if (!String(data.duration).trim()) newErrors.duration = "Продолжительность обязательна.";
    if (!String(data.trailerVideo).trim()) newErrors.trailerVideo = "Видео трейлера обязательно.";
    if (!String(data.typeFilm).trim()) newErrors.typeFilm = "Тип фильма обязателен.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    setErrors(validateFields(updatedFormData));
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles(newFiles);
  };

  const handleSave = () => {
    const currentErrors = validateFields();
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) return;

    const formDataWithFiles = new FormData();
    const genresArray = formData.genres?.split(",").map((g) => g.trim()) || [];
    const actorsArray = formData.actors?.split(",").map((a) => a.trim()) || [];

    for (const key in formData) {
      if (!["images", "genres", "actors"].includes(key)) {
        formDataWithFiles.append(key, formData[key]);
      }
    }

    formDataWithFiles.append("genres", JSON.stringify(genresArray));
    formDataWithFiles.append("actors", JSON.stringify(actorsArray));

    files.forEach((file) => {
      formDataWithFiles.append("images", file);
    });

    onSave(formDataWithFiles);
    onClose();
  };

  const handleDelete = () => {
    onDelete(formData.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{movieData ? "Редактировать фильм" : "Добавить новый фильм"}</DialogTitle>
      <DialogContent>
        {["title", "director", "description", "genres", "actors", "releaseDate", "ageRating", "duration", "trailerVideo", "typeFilm"].map((field) => (
          <TextField
            key={field}
            label={
              {
                title: "Название",
                director: "Режиссер",
                description: "Описание",
                genres: "Жанры (через запятую)",
                actors: "Актеры (через запятую)",
                releaseDate: "Дата релиза",
                ageRating: "Возрастной рейтинг",
                duration: "Продолжительность (мин)",
                trailerVideo: "Видео трейлера",
                typeFilm: "Тип фильма",
              }[field]
            }
            name={field}
            type={field === "releaseDate" ? "date" : "text"}
            value={formData[field] || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={field === "releaseDate" ? { shrink: true } : undefined}
            error={!!errors[field]}
            helperText={errors[field]}
          />
        ))}

        {movieData?.imageUrls?.length > 0 && (
          <>
            <Typography variant="subtitle1">Старые изображения:</Typography>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              {movieData.imageUrls.map((image, index) => (
                <img key={index} src={image} alt={`img-${index}`} width={100} />
              ))}
            </div>
          </>
        )}

        <input
          type="file"
          id="upload-button-file"
          style={{ display: "none" }}
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="upload-button-file">
          <Button variant="contained" component="span">
            Загрузить изображения
          </Button>
        </label>

        {files.length > 0 && (
          <Typography variant="body2" mt={1}>
            Загруженные файлы: {files.map((file) => file.name).join(", ")}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">Отмена</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={Object.keys(errors).length > 0}
        >
          {movieData ? "Обновить" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovieDialog;
