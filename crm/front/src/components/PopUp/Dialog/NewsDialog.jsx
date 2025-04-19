import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

const NewsDialog = ({ open, onClose, newsData, onSave, onDelete }) => {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (newsData) {
      setFormData({
        ...newsData,
        image: newsData.imageUrl || "",
      });
    } else {
      setFormData({});
    }

    setFile(null);
    setErrors({});
  }, [newsData]);

  const validateFields = (data = formData) => {
    const newErrors = {};
    if (!String(data.title).trim()) newErrors.title = "Заголовок обязателен.";
    if (!String(data.content).trim()) newErrors.content = "Содержимое обязательно.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    setErrors(validateFields(updatedFormData));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSave = () => {
    const currentErrors = validateFields();
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    const formDataWithFile = new FormData();
    for (const key in formData) {
      if (key !== "image") {
        formDataWithFile.append(key, formData[key]);
      }
    }

    if (file) {
      formDataWithFile.append("image", file);
    }

    if (formData.id) {
      // Обновление новости — можно передавать обычный объект (или адаптировать по твоей логике)
      onSave(formData);
    } else {
      // Создание новости с файлом
      onSave(formDataWithFile);
    }

    onClose();
  };

  const handleDelete = () => {
    onDelete(formData.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{newsData ? "Редактировать новость" : "Добавить новость"}</DialogTitle>
      <DialogContent >
        <TextField
          label="Заголовок"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          label="Содержимое"
          name="content"
          value={formData.content || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          error={!!errors.content}
          helperText={errors.content}
        />

        {!newsData?.id && (
          <Box mt={2}>
            {newsData?.imageUrl && (
              <Box mb={2}>
                <Typography variant="h6">Текущее изображение:</Typography>
                <img src={newsData.imageUrl} alt="news" width="100" />
              </Box>
            )}

            <input
              type="file"
              id="upload-news-image"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-news-image">
              <Button variant="contained" component="span">
                Загрузить изображение
              </Button>
            </label>

            {file && (
              <Typography variant="body2" mt={1}>
                Загружен файл: {file.name}
              </Typography>
            )}
          </Box>
        )}
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
          {newsData ? "Обновить" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewsDialog;
