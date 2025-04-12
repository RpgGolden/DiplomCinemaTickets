import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
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
    const genresArray = typeof formData.genres === "string" && formData.genres.trim() !== ""
    ? formData.genres.split(",").map(item => item.trim())
    : [];
  const actorsArray = typeof formData.actors === "string" && formData.actors.trim() !== ""
    ? formData.actors.split(",").map(item => item.trim())
    : [];

    for (const key in formData) {
      if (key !== "images" && key !== "genres" && key !== "actors") {
        formDataWithFiles.append(key, formData[key]);
      }
    }

    formDataWithFiles.append("genres", JSON.stringify(genresArray));
    formDataWithFiles.append("actors", JSON.stringify(actorsArray));

    if (files.length > 0) {
      files.forEach((file) => {
        formDataWithFiles.append("images", file);
      });
    }

    if (movieData?.imageUrls?.length > 0) {
      movieData.imageUrls.forEach((image) => {
        formDataWithFiles.append("images", image);
      });
    }

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
        <TextField
          label="Название"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          label="Режиссер"
          name="director"
          value={formData.director || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.director}
          helperText={errors.director}
        />
        <TextField
          label="Описание"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          label="Жанры (через запятую)"
          name="genres"
          value={formData.genres || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.genres}
          helperText={errors.genres}
        />
        <TextField
          label="Актеры (через запятую)"
          name="actors"
          value={formData.actors || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.actors}
          helperText={errors.actors}
        />
        <TextField
          label="Дата релиза"
          name="releaseDate"
          type="date"
          value={formData.releaseDate || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.releaseDate}
          helperText={errors.releaseDate}
        />
        <TextField
          label="Возрастной рейтинг"
          name="ageRating"
          value={formData.ageRating || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.ageRating}
          helperText={errors.ageRating}
        />
        <TextField
          label="Продолжительность (мин)"
          name="duration"
          value={formData.duration || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.duration}
          helperText={errors.duration}
        />
        <TextField
          label="Видео трейлера"
          name="trailerVideo"
          value={formData.trailerVideo || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.trailerVideo}
          helperText={errors.trailerVideo}
        />
        <TextField
          label="Тип фильма"
          name="typeFilm"
          value={formData.typeFilm || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.typeFilm}
          helperText={errors.typeFilm}
        />

        {movieData?.imageUrls?.length > 0 && (
          <div>
            <h4>Старые изображения:</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              {movieData.imageUrls.map((image, index) => (
                <img key={index} src={image} alt={`image-${index}`} width="100" />
              ))}
            </div>
          </div>
        )}

        <input type="file" multiple onChange={handleFileChange} />
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
