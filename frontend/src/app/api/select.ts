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
