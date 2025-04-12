import { useEffect, useState } from "react";
import styles from "./Requests.module.scss"
import {getAllTickets} from "../../../API/apiRequest"
import UniversalTable from "../../../components/UniversalTable/UniversalTable";
import { requestColumns } from "../../../utils/ColumnsTable";

function Requests() {
    const [requestData, setRequestData] = useState([]);
    useEffect(() => {
        getAllTickets().then(res => {
            setRequestData(res.data)
        }) 
    },[])
    return (
        <div className={styles.Requests}>
             <UniversalTable
                columns={requestColumns}
                data={requestData}
                editingMode={false}
            />
        </div>
    );
}

export default Requests;