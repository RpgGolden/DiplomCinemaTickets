import { useEffect, useState } from "react";
import styles from "./Requests.module.scss"
import {deleteTicket, getAllTickets} from "../../../API/apiRequest"
import UniversalTable from "../../../components/UniversalTable/UniversalTable";
import { requestColumns } from "../../../utils/ColumnsTable";

function Requests() {
    const [requestData, setRequestData] = useState([]);
    useEffect(() => {
        getAllTickets().then(res => {
            setRequestData(res.data)
        }) 
    },[])

    const deleteRequest = (id) =>{
        console.log(id)
        deleteTicket(id).then(res => {
            if(res.status === 200){
                getAllTickets().then(res => {
                    if(res.status === 200){
                        setRequestData(res.data)
                    }
                })
            }
        })
    }
    return (
        <div className={styles.Requests}>
             <UniversalTable
                columns={requestColumns}
                data={requestData}
                editingMode={false}
                onDelete={deleteRequest}
            />
        </div>
    );
}

export default Requests;