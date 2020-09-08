import React, { useState, useEffect, useRef } from "react";

import Button from "../Button/Button";

import "./Table.scss";
import { createRef } from "react";

const TableCol = ({ children }) => {
  return <div className="table__col">{children}</div>;
};

const TableHeader = (props) => {
  const header = [
    "№",
    "ФИО",
    "Возраст (лет)",
    "Рост",
    "Вес",
    "Зарплата",
    "Управление",
  ];

  const [
    radioStatusForAllChoiseElements,
    setRadioStatusForAllChoiseElements,
  ] = useState(false);

  const selectAllRows = () => {
    setRadioStatusForAllChoiseElements(true);

    if (radioStatusForAllChoiseElements) {
      let arr = props.customData.map((row) => {
        row.selected = false;

        return row;
      });
      props.setCustomData(arr);
      props.setSelectedRows([]);

      setRadioStatusForAllChoiseElements(false);
    } else {
      let arr = props.customData.map((row) => {
        row.selected = true;

        return row;
      });

      props.setSelectedRows(arr);
      props.setCustomData(arr);
    }
  };

  return (
    <div className="table__header">
      <div className="table__row">
        <div className="table__col">
          <TableRadio
            selected={radioStatusForAllChoiseElements}
            onClick={() => selectAllRows()}
          />
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

const TableRadio = (props) => {
  return (
    <div className="table-row__checker">
      <input
        type="radio"
        className="table-row__radio"
        checked={props.selected}
        onChange={() => {}}
      />
      <div className="table-row__radio-custom" onClick={props.onClick} />
    </div>
  );
};

const TableRow = (props) => {
  const selectRow = (id) => {
    const arr = props.customData.map((row) => {
      if (row.id == id) {
        row.selected ? (row.selected = false) : (row.selected = true);
      }

      return row;
    });
    props.setSelectedRows(arr.filter(row => row.selected))
    props.setCustomData(arr);
  };

  const deleteRow = (id) => {
    props.setCustomData(props.customData.filter((row) => row.id != id));
  };

  return (
    <div className="table__row table-row">
      <TableCol>
        <TableRadio
          selected={props.selected}
          onClick={() => selectRow(props.id)}
        />
      </TableCol>
      <TableCol>{props.index}</TableCol>
      <TableCol>{`${props.first_name} ${props.last_name}`}</TableCol>
      <TableCol>{props.customeAge}</TableCol>
      <TableCol>{props.customHeight}</TableCol>
      <TableCol>{props.customWeight}</TableCol>
      <TableCol>{props.customeSalary}</TableCol>
      <div className="table__col table-row__buttons">
        <Button img spriteID="#pencil" onClick={() => {}} />
        <Button img spriteID="#basket" onClick={() => deleteRow(props.id)} />
      </div>
    </div>
  );
};

const Table = (props) => {
  const [moneyDataUSD, setMoneyDataUSD] = useState(null);

  const [customData, setCustomData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const data = props.data?.map((item) => ({
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
    return `${Math.round(weight / 2.205)} кг`;
  };

  const convertSalary = (salary) => {
    return `$ ${Math.round(salary * moneyDataUSD)} `;
  };

  const convertUNIXtoAge = (unix) => {
    let age = 0;
    let userUNIX = new Date(unix * 1000);
    let date = `${userUNIX.getFullYear()}-${
      userUNIX.getMonth() + 1
    }-${userUNIX.getDate()}`;

    age = get_current_age(date);

    function get_current_age(date) {
      return (
        ((new Date().getTime() - new Date(date)) /
          (24 * 3600 * 365.25 * 1000)) |
        0
      );
    }

    return `${age}`;
  };

  const deleteSelectedRows = () => {
    setCustomData(customData.filter((row) => !row.selected));
  };

  return (
    <div className="table">
      <TableHeader
        customData={customData}
        setCustomData={setCustomData}
        setSelectedRows={setSelectedRows}
      />
      {customData?.map((item, index) => (
        <TableRow
          key={index}
          index={++index}
          customData={customData}
          setCustomData={setCustomData}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          {...props}
          {...item}
        />
      ))}
      <div className="table__controlls">
        <Button
          title="Удалить выбранные"
          disabled={selectedRows.length === 0}
          onClick={deleteSelectedRows}
        />
      </div>
    </div>
  );
};

export default Table;
