const API_URL = 'http://localhost:5000/api/transactions';

const getToken = () => localStorage.getItem('token');

export const fetchTransactions = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
};

export const createTransaction = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const deleteTransaction = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
};

export const updateTransaction = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};