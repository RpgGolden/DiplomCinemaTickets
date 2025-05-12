// PlaceDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

const PlaceDialog = ({ open, onClose, categoryData, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    categoryName: "",
    price: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categoryData) {
      setFormData({
        categoryName: categoryData.categoryName || "",
        price: categoryData.price || ""
      });
    } else {
      setFormData({
        categoryName: "",
        price: ""
      });
    }
    setErrors({});
  }, [categoryData, open]);

  const validateFields = (data = formData) => {
    const newErrors = {};
    
    if (!data.categoryName || data.categoryName.trim() === "") {
      newErrors.categoryName = "Название категории обязательно";
    } else if (data.categoryName.length > 50) {
      newErrors.categoryName = "Название не должно превышать 50 символов";
    }
    
    if (!data.price) {
      newErrors.price = "Цена обязательна";
    } else if (isNaN(data.price)) {
      newErrors.price = "Цена должна быть числом";
    } else if (Number(data.price) <= 0) {
      newErrors.price = "Цена должна быть больше 0";
    } else if (Number(data.price) > 10000) {
      newErrors.price = "Цена не должна превышать 10 000";
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "price" && value !== "" && isNaN(value)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? value.replace(/\D/g, "") : value
    }));

    setErrors(prev => {
      const updated = { ...prev };
      if (updated[name]) delete updated[name];
      return updated;
    });
  };

  const handleSave = async () => {
    const currentErrors = validateFields();
    setErrors(currentErrors);
    
    if (Object.keys(currentErrors).length > 0) return;
    
    setIsLoading(true);
    try {
      const dataToSave = {
        ...formData,
        price: Number(formData.price)
      };
      
      // Если есть categoryData.id - значит это редактирование
      if (categoryData?.id) {
        dataToSave.id = categoryData.id;
      }
      
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryData?.id) return;
    
    setIsLoading(true);
    try {
      await onDelete(categoryData.id);
      onClose();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {categoryData ? "Редактировать категорию" : "Создать новую категорию"}
      </DialogTitle>
      
      <DialogContent>
        <TextField
          label="Название категории"
          name="categoryName"
          value={formData.categoryName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.categoryName}
          helperText={errors.categoryName}
          disabled={isLoading}
        />
        
        <TextField
          label="Цена (руб)"
          name="price"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.price}
          helperText={errors.price}
          disabled={isLoading}
          inputProps={{
            min: 1,
            max: 10000,
            step: 50
          }}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={isLoading}>
          Отмена
        </Button>
        
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={isLoading || Object.keys(validateFields()).length > 0}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : categoryData ? (
            "Обновить"
          ) : (
            "Создать"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaceDialog;