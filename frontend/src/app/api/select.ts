import axios from 'axios';

const apiUrl = 'http://localhost:8080/api/';

export function select(value: any) {
  if (value.currentLanguage === 'en-US') {
    return axios.post(`${apiUrl}selectMobileOfficeByEnglish`, value);
  } else if (value.currentLanguage === 'zh-TW') {
    return axios.post(`${apiUrl}selectMobileOfficeByTraditionalChinese`, value);
  } else {
    return axios.post(`${apiUrl}selectMobileOfficeBySimplifiedChinese`, value);
  }
}
