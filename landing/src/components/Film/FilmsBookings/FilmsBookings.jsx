import { useState } from "react";
import styles from "./FilmBookings.module.scss";

function FilmBookings() {
  const rows = 5;
  const seatsPerRow = 10;

  const generateSeats = () => {
    const seats = [];
    for (let row = 1; row <= rows; row++) {
      for (let number = 1; number <= seatsPerRow; number++) {
        seats.push({
          id: `${row}-${number}`,
          row,
          number,
          isBooked: false,
        });
      }
    }
    return seats;
  };

  const [seats, setSeats] = useState(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (id) => {
    const seat = seats.find((s) => s.id === id);
    if (seat?.isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Выберите места</h2>

      {/* Экран */}
      <div className={styles.screen}><img src="/img/hallplan_ekran.png"/></div>

      <div className={styles.cinema}>
        {[...Array(rows)].map((_, rowIdx) => (
          <div key={rowIdx} className={styles.rowWrapper}>
            {/* Номер ряда слева */}
            <div className={styles.rowNumber}><p>ряд {rowIdx + 1}</p></div>

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

      <div className={styles.selection}>
        <strong>Выбранные места:</strong> {selectedSeats.join(", ")}
      </div>
    </div>
  );
}

export default FilmBookings;
