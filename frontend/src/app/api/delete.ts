import axios from 'axios';

const apiUrl = 'http://localhost:8080/api/';

export function deleteMobilePostOffice(officeID: number) {
  const params = { id: officeID };
  return axios.delete(`${apiUrl}deleteMobilePostOffice`, { params });
}
