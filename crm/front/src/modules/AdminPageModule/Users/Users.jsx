import { useEffect, useState } from "react";
import styles from "./Users.module.scss"
import { getAllUsers } from "../../../API/apiRequest";
import { userColumns } from "../../../utils/ColumnsTable";
import UniversalTable from "../../../components/UniversalTable/UniversalTable";

function Users() {

    const [userData, setUserData] = useState([]);
    useEffect(() => {
        getAllUsers().then(res => {
            setUserData(res.data)
        }) 
    },[])
    return (
        <div className={styles.Users}>
             <UniversalTable
                columns={userColumns}
                data={userData}
                editingMode={false}
                />
        </div>
    );
}

export default Users;