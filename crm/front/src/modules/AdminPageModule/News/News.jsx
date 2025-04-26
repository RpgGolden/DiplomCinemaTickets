import { useEffect, useState } from "react";
import styles from "./News.module.scss";
import {
  getAllNews,
  deleteNews,
  createNews,
  updateNews,
  svitchStatus,
} from "../../../API/apiRequest";
import UniversalTable from "../../../components/UniversalTable/UniversalTable";
import { newsColumns } from "../../../utils/ColumnsTable";
import NewsDialog from "../../../components/PopUp/Dialog/NewsDialog";

function News() {
  const [openDialog, setOpenDialog] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  const fetchNews = async () => {
    try {
      const res = await getAllNews();
      if (res.status === 200) {
        setNewsData(res.data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке новостей:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenDialog = (item = null) => {
    setSelectedNews(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNews(null);
  };

  const handleSaveNews = async (data) => {
    try {
      let res;

      if (data instanceof FormData || !data.id) {
        res = await createNews(data);
      } else {
        res = await updateNews(data.id, data);
      }

      if (res?.status === 200 || res?.status === 201) {
        await fetchNews();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Ошибка при сохранении новости:", error);
    }
  };

  const deleteNewsFunc = async (id) => {
    try {
      const res = await deleteNews(id);
      if (res.status === 200) {
        await fetchNews();
      }
    } catch (error) {
      console.error("Ошибка при удалении новости:", error);
    }
  };

  const changeStatus = (newsData) =>{
    svitchStatus(newsData.id).then(res => {
        if(res.status === 200){
            fetchNews()
        }
    })
  }

  return (
    <div className={styles.News}>
      <UniversalTable
        columns={newsColumns}
        data={newsData}
        onEdit={handleOpenDialog}
        onDelete={deleteNewsFunc}
        editingMode={true}
        addMode={true}
        onAdd={() => handleOpenDialog(null)}
        statusMode={true}
        onStatus={changeStatus}
      />
      <NewsDialog
        onSave={handleSaveNews}
        onDelete={deleteNewsFunc}
        open={openDialog}
        onClose={handleCloseDialog}
        newsData={selectedNews}
      
      />
    </div>
  );
}

export default News;
