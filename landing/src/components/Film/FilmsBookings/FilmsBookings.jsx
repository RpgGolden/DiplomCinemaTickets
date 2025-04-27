import { useEffect, useState } from "react";
import styles from "./FilmBookings.module.scss";
import { getOneSession, bookingTickets } from "../../../API/apiRequest";
import { useContext } from "react";
import DataContext from "../../../context";
import Loader from "../../Loader/Loader";
import { Trash2 } from "lucide-react";

function FilmBookings(props) {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userPaymentMethodId, setUserPaymentMethodId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { setViziblePopUp } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    // Load session information
    getOneSession(props.session.id).then((res) => {
      if (res.status === 200) {
        setSessionInfo(res.data);
        setSeats(
          res.data.seats.map((seat) => ({
            id: seat.id,
            row: seat.rowNumber,
            number: seat.seatNumber,
            isBooked: !seat.isAvailable,
            seatPriceCategory: seat.seatPriceCategory,
          }))
        );
      }
    });

    // Load payment methods from local storage
    const storedPaymentMethods = localStorage.getItem('userPaymentMethod');
    if (storedPaymentMethods) {
      setPaymentMethods(JSON.parse(storedPaymentMethods));
    }
  }, [props.session]);

  useEffect(() => {
    if (!seats || seats.length === 0 || selectedSeats.length === 0) {
      setTotalPrice(0); 
      return;
    }

    const selectedSeatsData = seats.filter((seat) => selectedSeats.includes(seat.id));

    const total = selectedSeatsData.reduce((total, seat) => {
      if (seat.seatPriceCategory && seat.seatPriceCategory.price) {
        return total + seat.seatPriceCategory.price;
      }
      return total;
    }, 0);

    setTotalPrice(total);
  }, [selectedSeats, seats]);

  const toggleSeat = (id) => {
    const seat = seats.find((s) => s.id === id);
    if (seat?.isBooked) return;

    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(id)) {
        return prevSelectedSeats.filter((s) => s !== id);
      } else {
        return [...prevSelectedSeats, id];
      }
    });
  };

  const handleConfirmBooking = () => {
    setIsLoading(true);
    const bookingData = {
      sessionId: props.session.id,
      seatIds: selectedSeats,
      userPaymentMethodId: userPaymentMethodId,
    };

    bookingTickets(bookingData).then((res) => {
      setIsLoading(false);
      if (res.status === 200 || res.status === 201) {
        setBookingConfirmed(true);
        setViziblePopUp("bookingConfirmed");
        props.setSelectedFilm(null);
      }
    });
  };

  const handleRemoveSeat = (id) => {
    setSelectedSeats((prevSelectedSeats) => prevSelectedSeats.filter((seatId) => seatId !== id));
  };

  // Function to map payment method types to display names
  const getPaymentMethodName = (methodType) => {
    switch (methodType) {
      case 'cash':
        return 'Наличными';
      case 'bonus':
        return 'Оплата бонусами';
      case 'cards':
        return 'Картой';
      default:
        return methodType;
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Выберите места</h2>

      <div className={styles.screen}>
        <img src="/img/hallplan_ekran.png" alt="Экран" />
      </div>

      <div className={styles.cinema}>
        {[...Array(props.session.hall.rowCount)].map((_, rowIdx) => (
          <div key={rowIdx} className={styles.rowWrapper}>
            <div className={styles.rowNumber}>
              <p>ряд {rowIdx + 1}</p>
            </div>

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
          <strong>Выбранные места:</strong>
          <div className={styles.selectedSeats}>
            {seats
              .filter((seat) => selectedSeats.includes(seat.id))
              .map((seat) => (
                <div key={seat.id} className={styles.seatTile}>
                  <span>Ряд {seat.row}</span>
                  <span>Место {seat.number}</span>
                  <Trash2 className={styles.trashIcon} onClick={() => handleRemoveSeat(seat.id)}/>
                </div>
              ))}
          </div>
        </div>

        <div className={styles.selection}>
          <strong>Итоговая стоимость:</strong> {totalPrice} руб.
        </div>

        {/* Payment Method Dropdown */}
        <div className={styles.selection}>
          <strong className={styles.label}>Способ оплаты:</strong>
          <select
            className={styles.paymentMethodDropdown}
            value={userPaymentMethodId}
            onChange={(e) => setUserPaymentMethodId(e.target.value)}
          >
            <option value="">Выберите способ оплаты</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {getPaymentMethodName(method.methodType)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!bookingConfirmed && (
        <div className={styles.actions}>
          <button className={styles.buttonBack} onClick={props.handleBackToSessions}>
            Назад
          </button>
          <button
            className={styles.buttonConfirm}
            onClick={() => handleConfirmBooking()}
            disabled={!userPaymentMethodId} // Дизейбл если не выбран метод
          >
            Подтвердить
          </button>
        </div>
      )}

      {isLoading && <Loader />}
    </div>
  );
}

export default FilmBookings;
