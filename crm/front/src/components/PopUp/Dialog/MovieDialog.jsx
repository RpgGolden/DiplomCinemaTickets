import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Chip,
  Box
} from "@mui/material";
import { typeFilm, genres } from "./../../../utils/Enums";

const MovieDialog = ({ open, onClose, movieData, onSave, onDelete }) => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    if (movieData) {
      const initialGenres = Array.isArray(movieData.genres) 
        ? movieData.genres 
        : (movieData.genres || "").split(",").map(g => g.trim()).filter(Boolean);
      
      setFormData({
        ...movieData,
        genres: initialGenres.join(", "),
        actors: movieData.actors || "" // Ensure it's a string
      });
      setSelectedGenres(initialGenres);
    } else {
      setFormData({
        title: '',
        director: '',
        description: '',
        actors: '', // Initialize as empty string
        releaseDate: '',
        ageRating: '',
        duration: '',
        trailerVideo: '',
        typeFilm: ''
      });
      setSelectedGenres([]);
    }
    setFiles([]);
    setErrors({});
  }, [movieData, open]);
  

  const validateFields = (data = formData) => {
    const newErrors = {};
    if (!String(data.title).trim()) newErrors.title = "Название обязательно.";
    if (!String(data.director).trim()) newErrors.director = "Режиссер обязателен.";
    if (!String(data.description).trim()) newErrors.description = "Описание обязательно.";
    if (selectedGenres.length === 0) newErrors.genres = "Выберите хотя бы один жанр.";
    if (!String(data.actors).trim()) newErrors.actors = "Актеры обязательны.";
    if (!String(data.releaseDate).trim()) newErrors.releaseDate = "Дата релиза обязательна.";
    if (!String(data.ageRating).trim()) newErrors.ageRating = "Возрастной рейтинг обязателен.";
    if (!String(data.duration).trim()) newErrors.duration = "Продолжительность обязательна.";
    if (!String(data.trailerVideo).trim()) newErrors.trailerVideo = "Видео трейлера обязательно.";
    if (!String(data.typeFilm).trim()) newErrors.typeFilm = "Тип фильма обязателен.";
    return newErrors;
  };

  const handleGenreChange = (event) => {
    const { value } = event.target;
    setSelectedGenres(value);
    setFormData(prev => ({
      ...prev,
      genres: value.join(", ")
    }));
    setErrors(prev => ({
      ...prev,
      genres: undefined
    }));
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
    const actorsArray = typeof formData.actors === 'string' 
      ? formData.actors.split(",").map((a) => a.trim()) 
      : []; // Ensure it's a string before splitting
  
    for (const key in formData) {
      if (!["images", "genres", "actors"].includes(key)) {
        formDataWithFiles.append(key, formData[key]);
      }
    }
  
    formDataWithFiles.append("genres", JSON.stringify(selectedGenres));
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{movieData ? "Редактировать фильм" : "Добавить новый фильм"}</DialogTitle>
      <DialogContent>
        {["title", "director", "description", "actors", "releaseDate", "ageRating", "duration", "trailerVideo"].map((field) => (
          <TextField
            key={field}
            label={
              {
                title: "Название",
                director: "Режиссер",
                description: "Описание",
                actors: "Актеры (через запятую)",
                releaseDate: "Дата релиза",
                ageRating: "Возрастной рейтинг",
                duration: "Продолжительность (мин)",
                trailerVideo: "Видео трейлера",
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

        {/* Селектор жанров с множественным выбором */}
        <FormControl fullWidth margin="normal" error={!!errors.genres}>
          <InputLabel>Жанры</InputLabel>
          <Select
            multiple
            label="Жанры"
            value={selectedGenres}
            onChange={handleGenreChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={genres[value] || value} />
                ))}
              </Box>
            )}
          >
            {Object.entries(genres).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                <Checkbox checked={selectedGenres.indexOf(value) > -1} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
          {errors.genres && <Typography color="error" variant="caption">{errors.genres}</Typography>}
        </FormControl>

        {/* Селектор для типа фильма */}
        <FormControl fullWidth margin="normal" error={!!errors.typeFilm}>
          <InputLabel>Тип фильма</InputLabel>
          <Select
            label="Тип фильма"
            name="typeFilm"
            value={formData.typeFilm || ""}
            onChange={handleChange}
          >
            {Object.entries(typeFilm).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
          {errors.typeFilm && <Typography color="error" variant="caption">{errors.typeFilm}</Typography>}
        </FormControl>

        {/* Остальной код (изображения и т.д.) */}
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