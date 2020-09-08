import React, { useState, useEffect } from "react";

import Title from "./components/Title/Title";
import Table from "./components/Table/Table";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const url = "https://api.npoint.io/324f4ca2cdd639760638";
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <div className="app">
      <Title title="Таблица пользователей" />
      <Table data={data} setData={setData} />
    </div>
  );
};

export default App;
