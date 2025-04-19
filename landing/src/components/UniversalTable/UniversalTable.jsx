import React, { useContext, useEffect, useState } from "react";
import DataContext from "../../context";
import styles from "./UniversalTable.module.scss";



function UniversalTable(props) {
  const { context } = useContext(DataContext);
  const [tableHeaderData, setTableHeaderData] = useState([]);
  const [tableBodyData, setTableBodyData] = useState([]);


 
  useEffect(() => {
    setTableHeaderData(props?.tableHeader);
    setTableBodyData(filterBasickData(props?.tableBody, store));
  }, [props?.tableHeader, props?.tableBody]);



  const getValue = (value, key) => {
    switch (key) {
      default:
        return value || "___";
    }
  };

 
  return (
    <div
      className={styles.UniversalTable}>
      <table>
        <thead>
          {tableHeaderData?.map((el, index) => (
            <th
              key={index}
              name={el.key}>
              {el.value}
             </th>
          ))}
        </thead>
        <tbody>
          {tableBodyData?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
            >
              {tableHeaderData.map((header) => (
                <td
                  key={header.key}
                  name={header.key}
                  className={header.key}
                >
                </td>
              ))}
            </tr>
          ))}
          {tableBodyData.length === 0 && (
            <tr>
              <td
                colSpan={tableHeaderData.length}
                className={styles.tableNotData}
              >
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UniversalTable;
