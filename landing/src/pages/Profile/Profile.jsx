import { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import {
	getDataProfile,
	getBonusHistory,
	uploadProfileImage,
	getUserTickets,
	cancelUserTicket,
} from '../../API/apiRequest';
import Header from '../../components/Header/Header';
import { toast } from 'react-toastify';

function Profile() {
	const [userData, setUserData] = useState(null);
	const [bonusHistory, setBonusHistory] = useState([]);
	const [sortedBonusHistory, setSortedBonusHistory] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: 'asc',
	});

	const [userTickets, setUserTickets] = useState([]);
	const [sortedTickets, setSortedTickets] = useState([]);
	const [ticketSortConfig, setTicketSortConfig] = useState({
		key: null,
		direction: 'asc',
	});

	const [activeTab, setActiveTab] = useState('tickets');

	useEffect(() => {
		getDataProfile().then((resp) => {
			if (resp?.status === 200) {
				setUserData(resp.data);
			}
		});

		getBonusHistory().then((resp) => {
			if (resp?.status === 200) {
				const data = Array.isArray(resp.data) ? resp.data : [];
				setBonusHistory(data);
				setSortedBonusHistory(data);
			}
		});

		getUserTickets().then((resp) => {
			if (resp?.status === 200) {
				const data = Array.isArray(resp.data) ? resp.data : [];
				setUserTickets(data);
				setSortedTickets(data);
			}
		});
	}, []);

	const getTicketStatusText = (status) => {
		switch (status) {
			case 'cancelled':
				return 'Билет отменён';
			case 'purchased':
				return 'Билет куплен';
			case 'movie_started':
				return 'Идет фильм';
			case 'movie_ended':
				return 'Просмотр завершён';
			default:
				return 'Неизвестно';
		}
	};

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			toast.error('Можно загружать только изображения!');
			return;
		}

		const formData = new FormData();
		formData.append('image', file);

		try {
			const resp = await uploadProfileImage(formData);
			if (resp?.status === 200) {
				toast.success('Аватар успешно обновлён!');
				getDataProfile().then((resp) => {
					if (resp?.status === 200) {
						setUserData(resp.data);
					}
				});
			} else {
				toast.error('Ошибка загрузки аватара!');
			}
		} catch (error) {
			toast.error('Произошла ошибка при загрузке.');
		}
	};

	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });

		const sorted = [...bonusHistory].sort((a, b) => {
			let aValue = a[key];
			let bValue = b[key];

			if (key === 'createdAt') {
				aValue = new Date(aValue);
				bValue = new Date(bValue);
			}

			if (aValue < bValue) return direction === 'asc' ? -1 : 1;
			if (aValue > bValue) return direction === 'asc' ? 1 : -1;
			return 0;
		});

		setSortedBonusHistory(sorted);
	};

	const handleCancelTicket = async (ticketId) => {
		const confirmed = window.confirm(
			'Вы уверены, что хотите отменить билет?'
		);
		if (!confirmed) return;

		try {
			const resp = await cancelUserTicket(ticketId);
			if (resp?.status === 200) {
				toast.success('Билет успешно отменён!');
				// Обновляем список билетов
				getUserTickets().then((resp) => {
					if (resp?.status === 200) {
						const data = Array.isArray(resp.data) ? resp.data : [];
						setUserTickets(data);
						setSortedTickets(data);
					}
				});
			} else {
				toast.error('Ошибка при отмене билета!');
			}
		} catch (error) {
			toast.error('Произошла ошибка.');
		}
	};

	const paymentMethodLabels = {
		cards: 'Картой',
		cash: 'Наличными',
		bonus: 'Бонусами',
	};

	const handleTicketSort = (key) => {
		let direction = 'asc';
		if (
			ticketSortConfig.key === key &&
			ticketSortConfig.direction === 'asc'
		) {
			direction = 'desc';
		}
		setTicketSortConfig({ key, direction });

		const sorted = [...userTickets].sort((a, b) => {
			let aValue = a[key];
			let bValue = b[key];

			if (key === 'sessionTime') {
				const parseDate = (str) => {
					const [day, month, yearAndTime] = str.split('-');
					const [year, time] = yearAndTime.split(' ');
					return new Date(`${year}-${month}-${day}T${time}`);
				};
				aValue = parseDate(aValue);
				bValue = parseDate(bValue);
			}

			if (typeof aValue === 'string') {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (aValue < bValue) return direction === 'asc' ? -1 : 1;
			if (aValue > bValue) return direction === 'asc' ? 1 : -1;
			return 0;
		});

		setSortedTickets(sorted);
	};

	return (
		<main>
			<Header />
			<div className={styles.Profile}>
				<div className={styles.sidebar}>
					<div className={styles.userInfo}>
						<label className={styles.avatarUpload}>
							{userData?.avatar && userData.avatar !== 'null' ? (
								<img
									src={userData.avatar}
									alt="avatar"
									className={styles.avatar}
								/>
							) : (
								<div className={styles.avatarPlaceholder}>
									{userData?.name
										? userData.name.charAt(0).toUpperCase()
										: '?'}
								</div>
							)}
							<div className={styles.hoverOverlay}>Тык</div>
							<input
								type="file"
								accept="image/*"
								onChange={handleFileUpload}
							/>
						</label>

						<p>{userData?.name}</p>
						<p>{userData?.email}</p>
					</div>

					<div className={styles.menu}>
						<div
							className={`${styles.menuItem} ${
								activeTab === 'tickets' ? styles.active : ''
							}`}
							onClick={() => setActiveTab('tickets')}
						>
							Мои билеты
						</div>
						<div
							className={`${styles.menuItem} ${
								activeTab === 'history' ? styles.active : ''
							}`}
							onClick={() => setActiveTab('history')}
						>
							История бонусов
						</div>
						<div
							className={`${styles.menuItem} ${
								activeTab === 'addCard' ? styles.active : ''
							}`}
							onClick={() => setActiveTab('addCard')}
						>
							Добавить карту
						</div>
					</div>
				</div>

				<div className={styles.content}>
					{activeTab === 'tickets' ? (
						<div className={styles.section}>
							<h2>Мои билеты</h2>
							{sortedTickets.length > 0 ? (
								<div className={styles.bonusTableWrapper}>
									<table className={styles.bonusTable}>
										<thead>
											<tr>
												<th
													onClick={() =>
														handleTicketSort(
															'sessionTime'
														)
													}
												>
													Дата сеанса{' '}
													{ticketSortConfig.key ===
														'sessionTime' &&
														(ticketSortConfig.direction ===
														'asc'
															? '↑'
															: '↓')}
												</th>
												<th>Фильм</th>
												<th>Ряд</th>
												<th>Место</th>
												<th className={styles.paymentMethod}>Способ оплаты</th>
												<th className={styles.price}
													onClick={() =>
														handleTicketSort(
															'seatPrice'
														)
													}
												>
													Цена{' '}
													{ticketSortConfig.key ===
														'seatPrice' &&
														(ticketSortConfig.direction ===
														'asc'
															? '↑'
															: '↓')}
												</th>
												<th
													onClick={() =>
														handleTicketSort(
															'ticketStatus'
														)
													}
												>
													Статус{' '}
													{ticketSortConfig.key ===
														'ticketStatus' &&
														(ticketSortConfig.direction ===
														'asc'
															? '↑'
															: '↓')}
												</th>
											</tr>
										</thead>
										<tbody>
											{sortedTickets.map((ticket) => (
												<tr key={ticket.ticketId}>
													<td>
														{ticket.sessionTime ||
															'-'}
													</td>
													<td>
														{ticket.movieTitle ||
															'-'}
													</td>
													<td>
														{ticket.rowNumber ||
															'-'}
													</td>
													<td>
														{ticket.seatNumber ||
															'-'}
													</td>
													<td
														className={
															styles.paymentMethod
														}
													>
														{paymentMethodLabels[
															ticket.paymentMethod
														] || '-'}
													</td>
													<td
														className={styles.price}
													>
														{ticket.seatPrice
															? `${ticket.seatPrice} ₽`
															: '-'}
													</td>
													<td>
														<div
															style={{
																display:
																	'inline-flex',
																alignItems:
																	'center',
																justifyContent:
																	ticket.ticketStatus ===
																	'purchased'
																		? 'space-between'
																		: 'center',
																gap: '8px',
															}}
														>
															<span>
																{ticket.ticketStatus
																	? getTicketStatusText(
																			ticket.ticketStatus
																	  )
																	: '-'}
															</span>
															{ticket.ticketStatus ===
																'purchased' && (
																<button
																	className={
																		styles.iconButton
																	}
																	onClick={() =>
																		handleCancelTicket(
																			ticket.ticketId
																		)
																	}
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		width="22"
																		height="22"
																		fill="currentColor"
																		viewBox="0 0 16 16"
																	>
																		<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
																	</svg>
																</button>
															)}
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<p>Нет доступных билетов</p>
							)}
						</div>
					) : activeTab === 'history' ? (
						<div className={styles.section}>
							<h2>История начисления бонусов</h2>
							{sortedBonusHistory.length > 0 ? (
								<div className={styles.bonusTableWrapper}>
									<table className={styles.bonusTable}>
										<thead>
											<tr>
												<th
													onClick={() =>
														handleSort('createdAt')
													}
												>
													Дата{' '}
													{sortConfig.key ===
														'createdAt' &&
														(sortConfig.direction ===
														'asc'
															? '↑'
															: '↓')}
												</th>
												<th>Описание</th>
												<th
													onClick={() =>
														handleSort(
															'ticketPrice'
														)
													}
												>
													Цена билета{' '}
													{sortConfig.key ===
														'ticketPrice' &&
														(sortConfig.direction ===
														'asc'
															? '↑'
															: '↓')}
												</th>
												<th
													onClick={() =>
														handleSort('amount')
													}
												>
													Бонусы{' '}
													{sortConfig.key ===
														'amount' &&
														(sortConfig.direction ===
														'asc'
															? '↑'
															: '↓')}
												</th>
											</tr>
										</thead>
										<tbody>
											{sortedBonusHistory.map((bonus) => (
												<tr key={bonus.id}>
													<td>
														{bonus.createdAt
															? new Date(
																	bonus.createdAt
															  ).toLocaleDateString()
															: '-'}
													</td>
													<td>
														{bonus.description ||
															'-'}
													</td>
													<td>
														{bonus.ticketPrice
															? `${bonus.ticketPrice} ₽`
															: '-'}
													</td>
													<td>
														{bonus.amount > 0
															? `+${bonus.amount}`
															: bonus.amount}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<p>Нет начислений</p>
							)}
						</div>
					) : activeTab === 'addCard' ? (
						<div className={styles.section}>
							<h2>Добавить карту</h2>
							<p>Форма для добавления карты будет здесь</p>
						</div>
					) : null}
				</div>
			</div>
		</main>
	);
}

export default Profile;
