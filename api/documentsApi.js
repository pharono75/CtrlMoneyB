const API_URL = 'http://localhost:5000/api/documents';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const fetchDocuments = async () => {
  const res = await fetch(API_URL, { headers: getHeaders() });
  return res.json();
};

export const createDocument = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// ТЕПЕРЬ ОТПРАВЛЯЕМ КРИПТОДАННЫЕ
export const updateDocumentSign = async (id, signed, cryptoData = {}) => {
  const res = await fetch(`${API_URL}/${id}/sign`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ signed, ...cryptoData })
  });
  return res.json();
};

export const deleteDocument = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};