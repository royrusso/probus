const formatDateTime = (date: string) => {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleString();
};

export default formatDateTime;
