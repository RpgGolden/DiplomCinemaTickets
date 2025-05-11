import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";

const SessionDialog = ({ open, onClose, sessionData, onSave, onDelete, movies, halls }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sessionData) {
      setFormData(sessionData);
    } else {
      setFormData({});
    }
    setErrors({});
  }, [sessionData]);

  const validateFields = (data = formData) => {
    const newErrors = {};
    if (!data.movieId) newErrors.movieId = "Фильм обязателен.";
    if (!data.hallId) newErrors.hallId = "Зал обязателен.";
    if (!data.startTime) newErrors.startTime = "Время начала обязательно.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // Убираем ошибку для текущего поля, если оно было исправлено
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors[name]) {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  };

  const handleSave = () => {
    const currentErrors = validateFields();
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    // Преобразуем startTime в нужный формат
    const updatedFormData = {
        ...formData,
        sessionTime: formData.startTime ? new Date(formData.startTime).toISOString() : null,
      };
    
      // Убедитесь, что startTime теперь в правильном формате
      console.log("Formatted startTime:", updatedFormData.startTime);
    

    onSave(updatedFormData);  // Передаем данные с корректно отформатированным временем
    onClose();
  };

  const handleDelete = () => {
    onDelete(formData.id);
    onClose();
  };

  // Проверка, загружены ли данные
  if (!movies || !halls) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Загрузка...</DialogTitle>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{sessionData ? "Редактировать сеанс" : "Добавить новый сеанс"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal" error={!!errors.movieId}>
          <InputLabel>Выберите фильм</InputLabel>
          <Select
            label="Выберите фильм"
            name="movieId"
            value={formData.movieId || ""}
            onChange={handleChange}
          >
            {movies.map((movie) => (
              <MenuItem key={movie.id} value={movie.id}>
                {movie.title}
              </MenuItem>
            ))}
          </Select>
          {errors.movieId && <div>{errors.movieId}</div>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.hallId}>
          <InputLabel>Выберите зал</InputLabel>
          <Select
            label="Выберите зал"
            name="hallId"
            value={formData.hallId || ""}
            onChange={handleChange}
          >
            {halls.map((hall) => (
              <MenuItem key={hall.id} value={hall.id}>
                {hall.name}
              </MenuItem>
            ))}
          </Select>
          {errors.hallId && <div>{errors.hallId}</div>}
        </FormControl>

        <TextField
          label="Время начала"
          name="startTime"
          type="datetime-local"
          value={formData.startTime || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.startTime}
          helperText={errors.startTime}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={Object.keys(errors).length > 0}
        >
          {sessionData ? "Обновить" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionDialog;
