const URL = "https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json";
fetch(URL)
  .then((answer) => answer.json())
  .then((data) => {
    // В середине этой функции вам доступна переменная data хранящая данные по размещенным облигациям внутреннего займа
    let now = "2020-10-21";
    let future = [];

    for (let item of data) {
      item.repaydate = item.repaydate.split(".").reverse().join("-");
      if (item.repaydate > now) {
        future.push(item);
      }
    }

    //конвертация валюты в UAH
    for (let item of future) {
      if (item.valcode == "USD") {
        item.attraction *= 28;
        item.valcode = "UAH";
      } else if (item.valcode == "EUR") {
        item.attraction *= 33;
        item.valcode = "UAH";
      }
    }

    //Сортировка
    for (let j = 0; j < future.length - 1; j++) {
      for (let i = 0; i < future.length - 1; i++) {
        if (future[i + 1].repaydate < future[i].repaydate) {
          let temp = future[i];
          future[i] = future[i + 1];
          future[i + 1] = temp;
        }
      }
    }

    //Вычисление суммы платежей с одинаковой датой
    for (let j = 0; j < future.length - 1; j++) {
      for (let i = 0; i < future.length - 1; i++) {
        if (future[i].repaydate === future[i + 1].repaydate) {
          future[i].attraction += future[i + 1].attraction;
          future.splice(i + 1, 1);
        }
      }
    }
    let resultList = "";
    for (let item of future) {
      resultList += `</br> ${item.repaydate}: ${Math.round(item.attraction * 100) / 100
        } ${item.valcode} `;
    }
    outputPlace.innerHTML = resultList;
  });
