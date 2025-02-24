const removeTimeZone = date => {
    const newDate = new Date(date);
    const dateWithoutTimeZone = newDate.toISOString().slice(0, -5);
    return dateWithoutTimeZone;
};

export default removeTimeZone;