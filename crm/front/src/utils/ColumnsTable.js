import { useDispatch } from "react-redux";
import { openImageModal } from "../store/MoviesSlice/MoviesSlice";
import { methodType, roleClient, ticketStatus, typeFilm, genres} from "./Enums";

export const movieColumns = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'title',
    header: 'Название',
  },
  {
    accessorKey: 'director',
    header: 'Режиссёр',
  },
  {
    accessorKey: 'description',
    header: 'Описание',
    size: 300,
  },
  {
    accessorKey: 'genres',
    header: 'Жанры',
    Cell: ({ cell }) => {
      const genresArray = cell.getValue();
      return genresArray.map(genre => genres[genre] || genre).join(', ');
    },
  },
  {
    accessorKey: 'actors',
    header: 'Актёры',
    Cell: ({ cell }) => cell.getValue().join(', '),
  },
  {
    accessorKey: 'releaseDate',
    header: 'Дата релиза',
    Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
  },
  {
    accessorKey: 'ageRating',
    header: 'Возраст',
  },
  {
    accessorKey: 'duration',
    header: 'Длительность (мин)',
  },
  {
    accessorKey: 'trailerVideo',
    header: 'Трейлер',
  },
  {
    accessorKey: 'typeFilm',
    header: 'Тип',
    Cell: ({ cell }) => {
      const type = cell.getValue();
      return typeFilm[type] || type; // Check if type exists in typeFilm enum
    },
  },
  {
    accessorKey: "imageUrls",
    header: "Изображения",
    Cell: ({ cell }) => {
      const images = cell.getValue();
      const dispatch = useDispatch();
      return (
        <div style={{ display: "flex", gap: 8 }}>
          {images?.slice(0, 2).map((url, index) => (
            <img
              key={index}
              src={url}
              alt="movie"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 4,
                cursor: "pointer",
              }}
              onClick={() => dispatch(openImageModal(url))}
            />
          ))}
        </div>
      );
    },
  },
];


export const hallColumns = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'name',
    header: 'Название зала',
  },
  {
    accessorKey: 'rowCount',
    header: 'Количество рядов',
  },
  {
    accessorKey: 'seatCount',
    header: 'Количество мест',
  },
  {
    accessorKey: 'price',
    header: 'Цена за билет',
  },
  {
    accessorKey: 'categoryName',
    header: 'Категория мест',
  },
  {
    accessorKey: 'sessions',
    header: 'Сессии',
    Cell: ({ cell }) => {
      const sessions = cell.getValue();
      return (
        <div>
          {sessions.length > 0 ? (
            sessions.map(session => (
              <div key={session.id}>{new Date(session.sessionTime).toLocaleString()}</div>
            ))
          ) : (
            <span>Нет сессий</span>
          )}
        </div>
      );
    },
  },
];

export const sessionColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sessionTime",
    header: "Время сеанса",
  },
  {
    accessorKey: "isActive",
    header: "Статус",
    Cell: ({ cell }) => (cell.getValue() ? "Активно" : "Не активно"), // Преобразуем булевое значение в строку
  },
  {
    accessorKey: "repeatDaily",
    header: "Повтор ежедневно",
    Cell: ({ cell }) => (cell.getValue() ? "Да" : "Нет"),
  },
  {
    accessorKey: "hall.name",
    header: "Зал",
  },
  {
    accessorKey: "movie.title",
    header: "Фильм",
  },
];

export const promotionColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Заголовок",
  },
  {
    accessorKey: "isOutput",
    header: "Статус вывода",
    Cell: ({ cell }) => (cell.getValue() ? "Выведено" : "Не выведено"), // Преобразуем булевое значение в строку
  },
  {
    accessorKey: "description",
    header: "Описание",
  },
  {
    accessorKey: "imageUrl",
    header: "Изображение",
    Cell: ({ cell }) => {
      const imageUrl = cell.getValue(); // Получаем URL изображения
      const dispatch = useDispatch(); // Используем dispatch внутри компонента
      return (
        <div style={{ display: "flex", gap: 8 }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="promotion"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 4,
                cursor: "pointer",
              }}
              onClick={() => dispatch(openImageModal(imageUrl))} // Открываем модалку по клику на изображение
            />
          )}
        </div>
      );
    },
  },
];

export const userColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Имя",
  },
  {
    accessorKey: "surname",
    header: "Фамилия",
  },
  {
    accessorKey: "patronymic",
    header: "Отчество",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Роль",
    Cell: ({ cell }) => (roleClient[cell.getValue()]),
  },
]

export const newsColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Заголовок",
  },
  {
    accessorKey: "content",
    header: "Контент",
  },
  {
    accessorKey: "status",
    header: "Статус",
    Cell: ({ cell }) => (cell.getValue() ? "Активно" : "Не активно"), // Преобразуем булевое значение в строку
  },
  {
    accessorKey: "imageUrl",
    header: "Изображение",
    Cell: ({ cell }) => {
      const imageUrl = cell.getValue(); // Получаем URL изображения
      const dispatch = useDispatch(); // Используем dispatch внутри компонента
      return (
        <div style={{ display: "flex", gap: 8 }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="promotion"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 4,
                cursor: "pointer",
              }}
              onClick={() => dispatch(openImageModal(imageUrl))} // Открываем модалку по клику на изображение
            />
          )}
        </div>
      );
    },
  },
] 

export const requestColumns = [

  {
    accessorKey: "ticketId",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Бронь на имя",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "ticketId",
    header: "Билет",
  },
  {
    accessorKey: "ticketStatus",
    header: "Статус",
    Cell: ({ cell }) => (ticketStatus[cell.getValue()]),
  },
  {
    accessorKey: "paymentMethod",
    header: "Способ оплаты",
    Cell: ({ cell }) => (methodType[cell.getValue()]),

  },
  {
    accessorKey: "seatNumber",
    header: "Место",
  },
  {
    accessorKey: "rowNumber",
    header: "Ряд",
  }
  ,
  {
    accessorKey: "sessionTime",
    header: "Время сеанса",
    Сell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
  },
  {
    accessorKey: "movieTitle",
    header: "Фильм",
  },
  {
    accessorKey: "isCancelled",
    header: "Отменён",
    Cell: ({ cell }) => (cell.getValue() ? "Да" : "Нет"), // Преобразуем булевое значение в строку
  },

];

export const postersColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Статус",
    Cell: ({ cell }) => (cell.getValue() ? "Активно" : "Не активно"), // Преобразуем булевое значение в строку
  },
  {
    accessorKey: "priority",
    header: "Приоритет",
  },
  {
    accessorKey: "createdAt",
    header: "Дата Создания",
    Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
  },
  {
    accessorKey: "imageUrl",
    header: "Изображение",
    Cell: ({ cell }) => {
      const imageUrl = cell.getValue(); // Получаем URL изображения
      const dispatch = useDispatch(); // Используем dispatch внутри компонента
      return (
        <div style={{ display: "flex", gap: 8 }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="promotion"
              style={{
                width: 500,
                height: 100,
                objectFit: "cover",
                borderRadius: 4,
                cursor: "pointer",
              }}
              onClick={() => dispatch(openImageModal(imageUrl))} // Открываем модалку по клику на изображение
            />
          )}
        </div>
      );
    },
  },
]

export const bonusesColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "surname",
    header: "Фамилия",
  },
  {
    accessorKey: "name",
    header: "Имя",
  },
  {
    accessorKey: "patronymic",
    header: "Отчество",
  },
  {
    accessorKey: "bonusPoints",
    header: "Кол-во бонусов",
  }
]

export const placeColums = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "categoryName",
    header: "Название категории",
  },
  {
    accessorKey: "price",
    header: "Стоимость",
  },
]
