import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

const PromotionsDialog = ({ open, onClose, promotionData, onSave, onDelete }) => {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null); // Single file state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (promotionData) {
      setFormData({
        ...promotionData,
        image: promotionData.imageUrl || "",
        endDate: promotionData.endDate || "",
      });
    } else {
      setFormData({});
    }

    setFile(null); // Reset file state
    setErrors({});
  }, [promotionData]);

  const validateFields = (data = formData) => {
    const newErrors = {};
    if (!String(data.title).trim()) newErrors.title = "Название обязательно.";
    if (!String(data.description).trim()) newErrors.description = "Описание обязательно.";
    if (!String(data.endDate).trim()) newErrors.endDate = "Дата окончания обязательна.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    setErrors(validateFields(updatedFormData));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Store the single file
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
      console.log('file', file);
      formDataWithFile.append("image", file); // Добавляем файл в FormData
    }
  
    // Передаем formData с файлом в родительскую функцию
    onSave(formDataWithFile);
    onClose();
  };
  

  const handleDelete = () => {
    onDelete(promotionData.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{promotionData ? "Редактировать акцию" : "Добавить новую акцию"}</DialogTitle>
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
          label="Дата завершения акции"
          name="endDate"
          type="datetime-local"
          value={formData.endDate || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.endDate}
          helperText={errors.endDate}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <div>
          {promotionData?.imageUrl && (
            <div>
              <h4>Текущее изображение:</h4>
              <img src={promotionData.imageUrl} alt="promotion" width="100" />
            </div>
          )}
          <input type="file" onChange={handleFileChange} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">Отмена</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={Object.keys(errors).length > 0}
        >
          {promotionData ? "Обновить" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromotionsDialog;
