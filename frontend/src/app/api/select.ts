import axios from 'axios';

const apiUrl = 'http://localhost:8080/api/';

export function select(value: any) {
  const params = {
    ...value,
  };
  if (value.currentLanguage === 'en-US') {
    return axios.get(`${apiUrl}selectMobileOfficeByEnglish`, { params });
  } else if (value.currentLanguage === 'zh-TW') {
    return axios.get(`${apiUrl}selectMobileOfficeByTraditionalChinese`, { params });
  } else {
    return axios.get(`${apiUrl}selectMobileOfficeBySimplifiedChinese`, { params });
  }
}

export function selectByID(id: number) {
  const params = { id };
  return axios.get(`${apiUrl}selectMobilePostOfficeByID`, { params });
}

export function selectMobilePostOfficeName() {
  return axios.get(`${apiUrl}selectMobilePostOfficeName`);
}

export function selectMobilePostOffice(value: any) {
  const params = {
    ...value,
  };
  return axios.get(`${apiUrl}selectMobilePostOffice`, { params });
}
