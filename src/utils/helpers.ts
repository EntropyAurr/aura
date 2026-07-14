export const formatDuration = (value) => {
  const min = Math.floor(value / 60);
  const sec = Math.floor(value % 60);

  return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
};
