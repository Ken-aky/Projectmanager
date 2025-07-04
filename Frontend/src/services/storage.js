export const getSessionData = (key, fallback = []) => {
  const data = sessionStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

export const setSessionData = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};
