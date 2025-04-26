import { useEffect, useRef, useState } from "react";
import styles from "./Posters.module.scss";
import { deletePoster, getAllPosters, createPoster, svitchStatusPoster } from "../../../API/apiRequest";
import { postersColumns } from "../../../utils/ColumnsTable";
import UniversalTable from "../../../components/UniversalTable/UniversalTable";
import { Button } from "@mui/material";

function Posters() {
  const [postersData, setPostersData] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = () => {
    getAllPosters().then(res => setPostersData(res.data));
  };

  const deleteNewsFunc = (id) => {
    deletePoster(id).then(res => {
      if (res.status === 200) {
        fetchPosters();
      }
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); // Предполагается, что на бэке поле называется "image"

    const res = await createPoster(formData);
    if (res.status === 200) {
      inputRef.current.value = ''; // очищаем инпут
      fetchPosters(); // обновляем таблицу
    }
  };

  const onAdd = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const changeStatus = (posterData) => {
    svitchStatusPoster(posterData.id).then(res => {
      if(res.status === 200){
        fetchPosters()
      }
    })
  }

  return (
    <div className={styles.Posters}>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleFileChange}
      />
      <UniversalTable
        columns={postersColumns}
        data={postersData}
        onDelete={deleteNewsFunc}
        onAdd={() => onAdd()}
        addMode={true}
        statusMode={true}
        onStatus={changeStatus}
      />
    </div>
  );
}

export default Posters;
