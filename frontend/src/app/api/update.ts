import axios from 'axios';

const apiUrl = 'http://localhost:8080/api/';

export function updateMobilePostOffice(officeID: number, data: any) {
  const params = { id: officeID, ...data };
  return axios.put(`${apiUrl}updateMobilePostOffice`, { params });
}
