import { useEffect, useState } from "react";
import styles from "./Profile.module.scss"
import { getDataProfile } from "../../API/apiRequest";

function Profile() {
    const [userData, setUserData] = useState(null)
    useEffect(()=>{
        getDataProfile().then((resp)=>{
            if(resp?.status === 200){
                setUserData(resp.data)
                console.log(resp.data)
            }
        })
    },[])
    return (
        <div className={styles.Profile}>
            <p>Profile</p>
            <p>{userData?.email}</p>
        </div>
    );
}

export default Profile;