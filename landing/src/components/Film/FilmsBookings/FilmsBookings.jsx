import { useEffect, useState } from "react";
import styles from "./FilmBookings.module.scss";
import { getOneSession, bookingTickets } from "../../../API/apiRequest"; // Добавьте функцию для подтверждения бронирования
import { useContext } from "react";
import DataContext from "../../../context";
import Loader from "../../Loader/Loader";

function FilmBookings(props) {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // Массив выбранных мест
  const [userPaymentMethodId, setUserPaymentMethodId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { setViziblePopUp } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false); // Стейт для лоадера

  useEffect(() => {
    // Загружаем информацию о сессии
    getOneSession(props.session.id).then((res) => {
      if (res.status === 200) {
        console.log("sessionInfo", res.data);
        setSessionInfo(res.data);
        setSeats(
          res.data.seats.map((seat) => ({
            id: seat.id,
            row: seat.rowNumber,
            number: seat.seatNumber,
            isBooked: !seat.isAvailable, // Если место не доступно, считаем его забронированным
            seatPriceCategory: seat.seatPriceCategory,
          }))
        );
      }
    });
  }, [props.session]);

  useEffect(() => {
    if (!seats || seats.length === 0 || selectedSeats.length === 0) return; // Предотвратить пересчет, если нет мест
  
    // Фильтруем выбранные места
    const selectedSeatsData = seats.filter((seat) => selectedSeats.includes(seat.id));
  
    // Проверка на наличие цен
    const total = selectedSeatsData.reduce((total, seat) => {
      if (seat.seatPriceCategory && seat.seatPriceCategory.price) {
        return total + seat.seatPriceCategory.price; // Если есть цена, добавляем
      }
      return total;
    }, 0);
  
    setTotalPrice(total); // Устанавливаем итоговую стоимость
  }, [selectedSeats, seats]); // Обновление при изменении выбранных мест или списка мест
  

  const toggleSeat = (id) => {
    const seat = seats.find((s) => s.id === id);
    console.log("seat", seat)
    if (seat?.isBooked) return; // Если место забронировано, ничего не делаем

    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(id)) {
        return prevSelectedSeats.filter((s) => s !== id); // Если место уже выбрано, удаляем его
      } else {
        return [...prevSelectedSeats, id]; // Иначе добавляем в выбранные
      }
    });
  };

  const handleConfirmBooking = () => {
    setIsLoading(true); // Включаем лоадер
    const bookingData = {
      sessionId: props.session.id,
      seatIds: selectedSeats, // Отправляем массив id мест
      userPaymentMethodId: 1,
    };

    bookingTickets(bookingData).then((res) => {
      setIsLoading(false); // Отключаем лоадер
      if (res.status === 200 || res.status === 201) {
        setBookingConfirmed(true);
        setViziblePopUp("bookingConfirmed");
        props.setSelectedFilm(null);
        console.log("Бронирование подтверждено", res.data);
      }
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Выберите места</h2>

      {/* Экран */}
      <div className={styles.screen}>
        <img src="/img/hallplan_ekran.png" alt="Экран" />
      </div>

      <div className={styles.cinema}>
        {[...Array(5)].map((_, rowIdx) => (
          <div key={rowIdx} className={styles.rowWrapper}>
            {/* Номер ряда слева */}
            <div className={styles.rowNumber}>
              <p>ряд {rowIdx + 1}</p>
            </div>

            {/* Ряд с местами */}
            <div className={styles.row}>
              {seats
                .filter((seat) => seat.row === rowIdx + 1)
                .map((seat) => (
                  <div
                    key={seat.id}
                    className={`${styles.seat} 
                        ${seat.isBooked ? styles.booked : ""}
                        ${selectedSeats.includes(seat.id) ? styles.selected : ""}
                    `}
                    onClick={() => toggleSeat(seat.id)}
                  >
                    {seat.number}
                  </div>
                ))}
            </div>
          </div>
        ))}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.free}`}></div>
            <span>Свободно</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.selectedLegend}`}></div>
            <span>Вы выбрали</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.bookedLegend}`}></div>
            <span>Занято</span>
          </div>
        </div>
      </div>
      <div className={styles.infoSelected}>
        <div className={styles.selection}>
          <strong>Выбранные места:</strong>{" "}
          {seats
            .filter((seat) => selectedSeats.includes(seat.id))
            .map((seat) => seat.number)
            .join(", ")}
        </div>

        {/* Подытог */}
        <div className={styles.selection}>
          <strong>Итоговая стоимость:</strong> {totalPrice} руб.
        </div>
      </div>

      {/* Кнопка подтверждения */}
      {!bookingConfirmed && (
        <div className={styles.actions}>
          <button className={styles.buttonBack} onClick={props.handleBackToSessions}>
            Назад
          </button>
          <button
            className={styles.buttonConfirm}
            onClick={() => handleConfirmBooking()}
          >
            Подтвердить
          </button>
        </div>
      )}

      {/* Лоадер */}
      {isLoading && (
       <Loader/>
      )}
    </div>
  );
}

export default FilmBookings;
