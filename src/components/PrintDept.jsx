import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import "../styles/Printdept.css";

const PrintDept = () => {
  const { deptView } = useAppContext();
  console.log(deptView);

  const createItemPairs = (items) => {
    let pairs = [];
    for (let i = 0; i < items.length - 1; i += 2) {
      pairs.push(`${items[i]} - ${items[i + 1]}`);
    }
    if (items.length % 2 !== 0) {
      pairs.push(`${items[items.length - 1]} - ${items[items.length - 1]}`);
    }
    return pairs;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Room</th>
            <th>Roll Numbers</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {deptView.map((item, index) => {
            const pairs = createItemPairs(item.rollNums);
            return item.rooms.map((room, roomIndex) => (
              <tr key={`${index}-${roomIndex}`}>
                {roomIndex === 0 ? (
                  <td className="class-column" rowSpan={item.rooms.length}>
                    {item.dept}
                  </td>
                ) : null}
                <td>{room}</td>
                <td>{pairs[roomIndex] || "-"}</td>
                <td>{item.count[roomIndex] || "-"}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PrintDept;
