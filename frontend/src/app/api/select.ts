import axios from 'axios';

const apiUrl = 'http://localhost:8080/api/';

export function select(value: any) {
  if (value.currentLanguage === 'en-US') {
    return axios.get(`${apiUrl}selectMobileOfficeByEnglish`, value);
  } else if (value.currentLanguage === 'zh-TW') {
    return axios.get(`${apiUrl}selectMobileOfficeByTraditionalChinese`, value);
  } else {
    return axios.get(`${apiUrl}selectMobileOfficeBySimplifiedChinese`, value);
  }
}
