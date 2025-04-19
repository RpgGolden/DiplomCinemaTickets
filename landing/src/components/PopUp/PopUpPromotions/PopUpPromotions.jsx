import { useEffect, useState } from "react";
import styles from "./PopUpPromotions.module.scss";
import { getAllPromotions } from "../../../API/apiRequest";

function PopUpPromotions({ close }) {
  const [promotionData, setPromotionData] = useState(null);

  useEffect(() => {
    getAllPromotions().then((resp) => {
      if (resp?.status === 200) {
        setPromotionData(resp.data);
      }
    });
  }, []);

  return (
    <div className={styles.PopUpPromotions}>
      <button className={styles.closeButton} onClick={close}>✕</button>
      <h3 className={styles.title}>Наши акции</h3>
      <div className={styles.promotionsContainer}>
        {promotionData?.length > 0 ? (
          promotionData.map((item) => (
            <div key={item.id} className={styles.promotionCard}>
            {
                item.imageUrl ? (
                  <img src={item.imageUrl} alt="img" className={styles.image} />
                ) : (
                  <img src="/img/noPhoto.png" alt="img" className={styles.image} />
                )
            }
              <div className={styles.promotionText}>
                <h4 className={styles.promotionTitle}>{item.title}</h4>
                <p className={styles.promotionDescription}>{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noPromotions}>Нет акций</p>
        )}
      </div>
    </div>
  );
}

export default PopUpPromotions;
