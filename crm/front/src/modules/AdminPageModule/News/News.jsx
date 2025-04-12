import { useEffect, useState } from "react";
import styles from "./News.module.scss"
import { getAllNews } from "../../../API/apiRequest";
import UniversalTable from "../../../components/UniversalTable/UniversalTable";
import { newsColumns } from "../../../utils/ColumnsTable";

function News() {
    const [newsData, setNewsData] = useState([]);
    useEffect(() => {
        getAllNews().then(res => {
            console.log("res", res.data)
            setNewsData(res.data)
        }) 
    },[])
    return (
        <div className={styles.News}>
             <UniversalTable
                columns={newsColumns}
                data={newsData}
                editingMode={false}
                addMode={true} // Разрешаем добавление
            />
        </div>
    );
}

export default News;