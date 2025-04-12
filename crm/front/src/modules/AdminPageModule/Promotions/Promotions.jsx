import { useDispatch, useSelector } from "react-redux";
import { promotionColumns } from "../../../utils/ColumnsTable";
import styles from "./Promotions.module.scss"
import { getAndSetPromotionData, setPromotionData } from "../../../store/PromotionsSlice/PromotionsSlice";
import { useEffect, useState } from "react";
import UniversalTable from "../../../components/UniversalTable/UniversalTable";
import { createPromotion, deletePromotion, updatePromotion } from "../../../API/apiRequest";
import PromotionsDialog from "../../../components/PopUp/Dialog/PromotionsDialog";

function Promotions() {
    const dispatch = useDispatch();
    const { promotionsData } = useSelector((state) => state.PromotionsSlice);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPromotions, setSelectedPromotions] = useState(null);

  useEffect(() => {
        dispatch(getAndSetPromotionData((data) => dispatch(setPromotionData(data))));
  }, [dispatch]);

    // Открытие модалки для добавления/редактирования фильма
    const handleOpenDialog = (promotion = null) => {
        setSelectedPromotions(promotion);
        setOpenDialog(true);
      };
    
      // Закрытие модалки
      const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPromotions(null);
      };
    

      const handleSavePromotions = (formData) => {
        console.log("formDataImage", formData.get("image")); // Используем .get() для извлечения изображения
      
        if (formData?.id) {
          // Обновляем существующий сеанс
          updatePromotion(formData.id, formData).then((resp) => {
            if (resp?.status === 200) {
              dispatch(getAndSetPromotionData((data) => dispatch(setPromotionData(data))));
            }
          });
        } else {
          // Создаем новый сеанс
          createPromotion(formData).then((resp) => {
            if (resp?.status === 200) {
              // Ваша логика для создания
            }
          });
        }
      };
      
       

  const handleDeleteMovie = (promotionId) => {
    deletePromotion(promotionId).then((resp) => {
      if (resp?.status === 200) {
        dispatch(getAndSetPromotionData((data) => dispatch(setPromotionData(data))));
      }
    });
  };

    return (
        <div className={styles.Promotions}>
             <UniversalTable
                columns={promotionColumns}
                data={promotionsData}
                onAdd={() => handleOpenDialog()}
                onEdit={handleOpenDialog}
                onDelete={handleDeleteMovie}
                editingMode={true}
                addMode={true} // Разрешаем добавление
                />
                <PromotionsDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    onSave={handleSavePromotions}
                    onDelete={handleDeleteMovie}
                    promotionData={selectedPromotions}
                />
        </div>
    );
}

export default Promotions;