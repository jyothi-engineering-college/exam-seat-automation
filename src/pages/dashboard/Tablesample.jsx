import React from "react"; 
import "../../styles/Table.css";
const Tablesample = () => (
  <center>
    <div className="table-container">
      <table className="my-table">
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  </center>
);
export default Tablesample;
