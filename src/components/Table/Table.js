import React, { useState, useEffect } from "react";

import Button from "../Button/Button";

import "./Table.scss";

const TableHeader = (props) => {
  const [header, setHeader] = useState([
    "№",
    "ФИО",
    "Возраст (лет)",
    "Рост",
    "Вес",
    "Зарплата",
    "Управление",
  ]);

  const [activeRadio, setActiveRadio] = useState(false);

  const selectAllRows = () => {
    const arr = props.customData.map((row) => {
      if (row.selected) {
        return { ...row, selected: false };
      } else {
        return { ...row, selected: true };
      }
    });

    props.setSelectedRows(arr);
    props.setCustomData(arr);
  };

  return (
    <div className="table__header">
      <div className="table__row">
        <div className="table__col">
          <div className="table-row__checker">
            <input
              type="radio"
              className="table-row__radio"
              checked={activeRadio}
              onChange={() => {}}
            />
            <div
              className="table-row__radio-custom"
              onClick={() => {
                selectAllRows();
                setActiveRadio(!activeRadio);
              }}
            />
          </div>
        </div>
        {header.map((item, index) => (
          <div className="table__col" key={index}>
            <div className="table__header-title">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TableRow = (props) => {
  const selectRow = (id) => {
    const arr = props.customData.map((row) => {
      if (row.id == id) {
        if (row.selected) {
          row.selected = false;
          props.setSelectedRows(
            props.selectedRows.filter((selRow) => selRow.id != id)
          );
        } else {
          row.selected = true;
          props.setSelectedRows([...props.selectedRows, { ...row }]);
        }
      }

      return row;
    });

    props.setCustomData(arr);
  };

  const deleteRow = (id) => {
    props.setCustomData(props.customData.filter((row) => row.id != id));
  };

  return (
    <div className="table__row table-row">
      <div className="table__col">
        <div className="table-row__checker">
          <input
            type="radio"
            className="table-row__radio"
            checked={props.selected}
            onChange={() => {}}
          />
          <div
            className="table-row__radio-custom"
            onClick={() => selectRow(props.id)}
          />
        </div>
      </div>
      <div className="table__col">{props.index}</div>
      <div className="table__col">{`${props.first_name} ${props.last_name}`}</div>
      <div className="table__col">{props.customeAge}</div>
      <div className="table__col">{`${props.customHeight}`}</div>
      <div className="table__col">{`${props.customWeight} кг`}</div>
      <div className="table__col">{`$ ${props.customeSalary}`}</div>
      <div className="table__col table-row__buttons">
        <Button img spriteID="#pencil" onClick={() => {}} />
        <Button img spriteID="#basket" onClick={() => deleteRow(props.id)} />
      </div>
    </div>
  );
};

const Table = (props) => {
  const [customData, setCustomData] = useState(null);
  const [moneyDataUSD, setMoneyDataUSD] = useState(null);

  useEffect(() => {
    const data =
      props.data &&
      props.data.map((item) => ({
        ...item,
        id: generateRowId(),
        customWeight: generateRowWeight(item.weight),
        customHeight: generateRowHeight(item.height),
        customeSalary: convertSalary(item.salary),
        customeAge: convertUNIXtoAge(item.date_of_birth),
        selected: false,
      }));

    setCustomData(data);
  }, [props.data]);

  useEffect(() => {
    const url = "https://api.exchangeratesapi.io/latest";
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMoneyDataUSD(data.rates.USD);
      });
  }, []);

  const generateRowId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  const generateRowHeight = (height) => {
    const oneFut = 30.48;
    const oneDyim = 2.54;
    const arr = [];

    height.split("'").forEach((item) => {
      let num = item;
      num = Number.parseInt(num);
      arr.push(num);
    });

    const resultInMeters = (arr[0] * oneFut + arr[1] * oneDyim).toFixed(0);

    const metres = resultInMeters.substr(0, 1);
    const sm = resultInMeters.substr(1, 3);

    return `${metres} м ${sm} см`;
  };

  const generateRowWeight = (weight) => {
    return Math.round(weight / 2.205);
  };

  const convertSalary = (salary) => {
    return Math.round(salary * moneyDataUSD);
  };

  const convertUNIXtoAge = (unix) => {
    let userUNIX = new Date(unix * 1000);

    let userYear = userUNIX.getFullYear();
    let userMonth = userUNIX.getUTCMonth() + 1;
    let userDay = userUNIX.getDate();

    let dateNow = new Date();

    let userBT = new Date(userYear, userMonth, userDay); //Дата рождения

    let today = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate()
    );

    let btInCurrentYear = new Date(
      today.getFullYear(),
      userBT.getMonth(),
      userBT.getDate()
    );

    let age;

    age = today.getFullYear() - userBT.getFullYear();

    if (today < userBT) {
      age = age - 1;
    }

    return age;

    // var now = new Date(); //Текущя дата
    // var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); //Текущя дата без времени
    // var dob = new Date(1997, 10, 24); //Дата рождения
    // var dobnow = new Date(today.getFullYear(), dob.getMonth(), dob.getDate()); //ДР в текущем году
    // var age; //Возраст

    // //Возраст = текущий год - год рождения
    // age = today.getFullYear() - dob.getFullYear();
    // //Если ДР в этом году ещё предстоит, то вычитаем из age один год
    // if (today < dobnow) {
    //   age = age - 1;
    // }
  };

  const deleteSelectedRows = () => {
    let arr = [];

    customData.map((row) => {
      if (!row.selected) {
        arr.push(row);
      }

      return row;
    });
    setCustomData(arr);
    props.setSelectedRows([]);
  };

  return (
    <div className="table">
      <TableHeader
        customData={customData}
        setCustomData={setCustomData}
        setSelectedRows={props.setSelectedRows}
      />
      {customData &&
        customData.map((item, index) => (
          <TableRow
            key={item.id}
            index={++index}
            customData={customData}
            setCustomData={setCustomData}
            {...props}
            {...item}
          />
        ))}
      <div className="table__controlls">
        <Button
          title="Удалить выбранные"
          disabled={props.selectedRows.length > 0 ? false : true}
          onClick={deleteSelectedRows}
        />
      </div>
    </div>
  );
};

export default Table;
