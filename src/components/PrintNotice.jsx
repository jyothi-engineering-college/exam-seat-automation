import React from "react";
import { useAppContext } from "../context/AppContext";
import "../styles/Printdept.css"; // Add your custom CSS here
import { useEffect } from "react";

const PrintNotice = () => {
  const { noticeBoardView } = useAppContext();

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
            <th>Class</th>
            <th>Register No</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {noticeBoardView.map(
            ({ class: className, items, count }, classIndex) => {
              const pairs = createItemPairs(items);
              const rowSpan = pairs.length || 1;

              return pairs.length > 0 ? (
                pairs.map((pair, pairIndex) => (
                  <tr key={`${className}-${pairIndex}`}>
                    {pairIndex === 0 && (
                      <td rowSpan={rowSpan} className="class-column">
                        {className}
                      </td>
                    )}
                    <td>{pair}</td>
                    <td>{count[pairIndex] || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr key={classIndex}>
                  <td className="class-column">{className}</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PrintNotice;
