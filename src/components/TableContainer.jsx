import React from "react";
import "../styles/Table.css";

const TableContainer = () => (
  <div className="table-container">
    <div className="header-container">
      <div className="heading-left">
        <h6 className="tdhd">Table Heading</h6>
        <div className="underline"></div>
      </div>

      <button className="action-button">Action</button>
    </div>
    <div className="table-wrapper">
      <table className="my-table">
        <thead>
          <tr>
            <th className="column-1">Header 1</th>
            <th className="column-2">Header 2</th>
            <th className="column-1">Header 1</th>
            <th className="column-2">Header 2</th>
            <th className="column-1">Header 1</th>
            <th className="column-2">Header 2</th>
            <th className="column-1">Header 1</th>
            <th className="column-2">Header 2</th>
            <th className="column-1">Header 1</th>
            <th className="column-2">Header 5</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="column-1">Data 1</td>
            <td className="column-2">Data 2</td>
            <td className="column-1">Data 1</td>
            <td className="column-2">Data 2</td>
            <td className="column-1">Data 1</td>
            <td className="column-2">Data 2</td>
            <td className="column-1">Data 1</td>
            <td className="column-2">Data 2</td>
            <td className="column-1">Data 1</td>
            <td className="column-2">Data 5</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  </div>
);

export default TableContainer;
