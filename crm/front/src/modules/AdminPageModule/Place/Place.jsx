// Place.jsx
import { useState } from "react";
import styles from "./Place.module.scss";
import { createPlaceCategory, deletePlace, getPlaceCategory, updatePlace } from "../../../API/apiRequest";
import { placeColums } from "../../../utils/ColumnsTable";
import PlaceDialog from "../../../components/PopUp/Dialog/PlaceDialog";
import UniversalTable from "../../../components/UniversalTable/UniversalTable";
import { useEffect } from "react";

function Place() {
    const [openDialog, setOpenDialog] = useState(false);
    const [dataPlace, setDataPlace] = useState(null);
    const [selectPlace, setSelectPlace] = useState(null);
    
    const fetchPlace = async () => {
        try {
            const res = await getPlaceCategory();
            if (res.status === 200) {
                setDataPlace(res.data);
            }
        } catch (error) {
            console.error("Ошибка при загрузке категорий мест:", error);
        }
    };

    useEffect(() => {
        fetchPlace();
    }, []);

    const handleOpenDialog = (item = null) => {
        setSelectPlace(item);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectPlace(null);
    };

    const handleSavePlace = async (data) => {
        try {
            let res;
            
            if (data.id) {
                // Обновление существующей категории
                res = await updatePlace(data.id, data);
            } else {
                // Создание новой категории
                res = await createPlaceCategory(data);
            }

            if (res?.status === 200 || res?.status === 201) {
                await fetchPlace();
                handleCloseDialog();
            }
        } catch (error) {
            console.error("Ошибка при сохранении категории:", error);
        }
    };

    const deletePlaceFunc = async (id) => {
        try {
            const res = await deletePlace(id);
            if (res.status === 200) {
                await fetchPlace();
            }
        } catch (error) {
            console.error("Ошибка при удалении категории:", error);
        }
    };

    return (
        <div className={styles.Place}>
            <UniversalTable
                columns={placeColums}
                data={dataPlace ? dataPlace : []}
                onEdit={handleOpenDialog}
                onDelete={deletePlaceFunc}
                editingMode={true}
                addMode={true}
                onAdd={() => handleOpenDialog(null)}
            />
            <PlaceDialog
                onSave={handleSavePlace}
                onDelete={deletePlaceFunc}
                open={openDialog}
                onClose={handleCloseDialog}
                categoryData={selectPlace}
            />
        </div>
    );
}

export default Place;