const dateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
  timeZone: 'UTC'
};

exports.convertDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {...dateTimeFormatOptions, timeZone: 'UTC'});
};

exports.getCurrentDate = () => {
  return new Intl.DateTimeFormat('en-GB', {...dateTimeFormatOptions, timeZone: 'Asia/Bangkok'})
    .format(new Date());
};
