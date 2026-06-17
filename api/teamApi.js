const API_URL = 'http://localhost:5000/api/team';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const fetchTeam = async () => {
  const res = await fetch(API_URL, { headers: getHeaders() });
  return res.json();
};

export const createTeamMember = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// ДОБАВЛЕНА ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ
export const updateTeamMember = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteTeamMember = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};