import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

const HallDialog = ({ open, onClose, hallData, onSave, onDelete }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(hallData ? { ...hallData } : {});
    setErrors({});
  }, [hallData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "rowCount" || name === "seatCount" || name === "price"
      ? value.replace(/\D/g, "") // удалим все, кроме цифр
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Удалим ошибку по мере ввода
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Название обязательно.";
    if (!formData.rowCount || Number(formData.rowCount) <= 0)
      newErrors.rowCount = "Количество рядов обязательно.";
    if (!formData.seatCount || Number(formData.seatCount) <= 0)
      newErrors.seatCount = "Количество мест обязательно.";
    if (!formData.categoryName?.trim())
      newErrors.categoryName = "Категория места обязательна.";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Цена обязательна.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    const isValid = validateFields();
    if (!isValid) return;

    const processedData = {
      ...formData,
      rowCount: Number(formData.rowCount),
      seatCount: Number(formData.seatCount),
      price: Number(formData.price),
    };

    onSave(processedData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{hallData ? "Редактировать зал" : "Добавить новый зал"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Название"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Количество рядов"
          name="rowCount"
          type="number"
          value={formData.rowCount || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.rowCount}
          helperText={errors.rowCount}
        />
        <TextField
          label="Количество мест"
          name="seatCount"
          type="number"
          value={formData.seatCount || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.seatCount}
          helperText={errors.seatCount}
        />
        <TextField
          label="Категория места"
          name="categoryName"
          value={formData.categoryName || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.categoryName}
          helperText={errors.categoryName}
        />
        <TextField
          label="Цена"
          name="price"
          type="number"
          value={formData.price || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.price}
          helperText={errors.price}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Отмена
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {hallData ? "Обновить" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HallDialog;
