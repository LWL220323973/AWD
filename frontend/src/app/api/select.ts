
const apiUrl = 'http://localhost:8080/api/';

export function select(value: any) {
  if (value.currentLanguage === 'en-US') {
    return fetch(`${apiUrl}selectMobileOfficeByEnglish`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    });

  } else if (value.currentLanguage === 'zh-TW') {
    return fetch(`${apiUrl}selectMobileOfficeByTraditionalChinese`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    });
  } else {
    return fetch(`${apiUrl}selectMobileOfficeBySimplifiedChinese`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    });
  }
}
