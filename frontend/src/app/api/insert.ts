import axios from 'axios';

const apiUrl = 'http://localhost:8080/api/';

export function insert(value: any) {
  const params = { ...value };
  return axios.post(`${apiUrl}insertMobilePostOffice`, params);
}
