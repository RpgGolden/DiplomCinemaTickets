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

const HallDialog = ({ open, onClose, hallData, onSave, onDelete, seatCategories }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(hallData ? { ...hallData } : {});
    setErrors({});
  }, [hallData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "rowCount" || name === "seatCount"
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

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = seatCategories.find(cat => cat.id === selectedCategoryId);
    
    setFormData((prev) => ({
      ...prev,
      seatCategoryId: selectedCategoryId,
      categoryName: selectedCategory.categoryName,
      price: selectedCategory.price
    }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Название обязательно.";
    if (!formData.rowCount || Number(formData.rowCount) <= 0)
      newErrors.rowCount = "Количество рядов обязательно.";
    if (!formData.seatCount || Number(formData.seatCount) <= 0)
      newErrors.seatCount = "Количество мест обязательно.";
    if (!formData.seatCategoryId)
      newErrors.seatCategory = "Категория места обязательна.";

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
      // categoryName и price берутся автоматически из выбранной категории
    };

    onSave(processedData);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{hallData ? "Редактировать зал" : "Добавить новый зал"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Название зала"
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
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Количество мест в ряду"
          name="seatCount"
          type="number"
          value={formData.seatCount || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.seatCount}
          helperText={errors.seatCount}
          inputProps={{ min: 1 }}
        />
        
        <FormControl fullWidth margin="normal" error={!!errors.seatCategory}>
          <InputLabel>Категория мест</InputLabel>
          <Select
            label="Категория мест"
            name="seatCategoryId"
            value={formData.seatCategoryId || ""}
            onChange={handleCategoryChange}
          >
            {seatCategories?.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.categoryName} ({category.price} руб.)
              </MenuItem>
            ))}
          </Select>
          {errors.seatCategory && (
            <div style={{ color: '#f44336', fontSize: '0.75rem', margin: '3px 14px 0' }}>
              {errors.seatCategory}
            </div>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Отмена
        </Button>
        {hallData && (
          <Button 
            onClick={() => onDelete(hallData.id)} 
            variant="contained" 
            color="error"
          >
            Удалить
          </Button>
        )}
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
        >
          {hallData ? "Обновить" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HallDialog;