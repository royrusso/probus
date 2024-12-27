const formatDateTime = (date: string) => {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleString();
};

export default formatDateTime;

const convertMicrosecondsToMilliseconds = (
  microseconds: number,
  precision: number = 2
) => {
  if (microseconds === 0 || !microseconds) {
    return "0";
  }

  let milliseconds = microseconds / 1000;
  return milliseconds.toFixed(precision);
};
export { convertMicrosecondsToMilliseconds };
