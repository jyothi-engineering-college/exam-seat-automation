import React, { useEffect } from "react";

const Printpage = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return <div>Printpage</div>;
};

export default Printpage;
