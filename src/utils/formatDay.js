export const formatDay = (year, month, day) => {
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return 'Invalid date';
    }

    const formattedDate = `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`;
    return formattedDate;
}