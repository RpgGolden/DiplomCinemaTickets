import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UniversalTable from "../../../components/UniversalTable/UniversalTable"; // Универсальная таблица
import { hallColumns } from "../../../utils/ColumnsTable"; // Столбцы для таблицы
import { getandSetHallData, setHallData } from "../../../store/HallsSlice/HallsSlice"; // Redux для залов
import styles from "./Halls.module.scss";
import { createHall, deleteHall } from "../../../API/apiRequest";
import HallDialog from "../../../components/PopUp/Dialog/HallDialog";

function Halls() {
  const dispatch = useDispatch();
  const { hallData } = useSelector((state) => state.HallsSlice); // Извлекаем данные о залах из Redux
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);

  // Загружаем данные о залах при монтировании компонента
  useEffect(() => {
        dispatch(getandSetHallData((data) => dispatch(setHallData(data))));
  }, [dispatch]);

  // Открытие модалки для добавления/редактирования зала
  const handleOpenDialog = (hall = null) => {
    setSelectedHall(hall);
    setOpenDialog(true);
  };

  // Закрытие модалки
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHall(null);
  };

  // Сохранение нового или обновленного зала
  const handleSaveHall = (formData) => {
    const hall = formData;
    const data = {
        hallName: formData.name,
        rowNumber: formData.rowCount,
        seatNumber: formData.seatCount,
        categoryName: formData.categoryName,
        price: formData.price
      }
    // if (hall.get("id")) {
    //   // Обновление зала
    // //   updateHall(hall.get("id"), hall).then((resp) => {
    // //     if (resp?.status === 200) {
    // //       dispatch(getandSetHallData((data) => dispatch(setHallData(data))));
    // //     }
    // //   });
    // } else {
      // Добавление нового зала
      createHall(data).then((resp) => {
        if (resp?.status === 200) {
          dispatch(getandSetHallData((data) => dispatch(setHallData(data))));
        }
      });
   //}
  };
  // Удаление зала
  const handleDeleteHall = (hallId) => {
    deleteHall(hallId).then((resp) => {
      if (resp?.status === 200) {
        dispatch(getandSetHallData((data) => dispatch(setHallData(data))));
      }
    });
  };

  return (
    <div className={styles.Halls}>
      <div className={styles.HallsTable}>
        <UniversalTable
          columns={hallColumns}
          data={hallData}
          onAdd={() => handleOpenDialog()} // Открытие модалки для добавления
          onEdit={handleOpenDialog} // Открытие модалки для редактирования
          onDelete={handleDeleteHall} // Удаление зала
          editingMode={false}
          addMode={true} // Разрешаем добавление
        />
      </div>

      {/* Модальное окно для добавления/редактирования зала */}
      <HallDialog
        open={openDialog}
        onClose={handleCloseDialog}
        hallData={selectedHall}
        onSave={handleSaveHall}
        onDelete={handleDeleteHall}
      />
    </div>
  );
}

export default Halls;
