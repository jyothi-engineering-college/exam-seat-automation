import TableContainer from "../../components/TableContainer";
import "../../styles/home.css";

function Home() {
  const props = { tableName: "Sample" };

  return (
    <>
      <div className="tdye">
        <h3 className="tdhd">Today's Exam</h3>
        <div className="underline"></div>
        <div className="tcwrap">
          <div className="tcard">
            <img src="../book.svg" alt="hi" />
            <div className="cdet">
              <h3>CS 21</h3>
              <p>Slot A</p>
            </div>
          </div>
          <div className="tcard">
            <img src="../book.svg" alt="hi" />
            <div className="cdet">
              <h3>CS 21</h3>
              <p>Slot A</p>
            </div>
          </div>
          <div className="tcard">
            <img src="../book.svg" alt="hi" />
            <div className="cdet">
              <h3>CS 21</h3>
              <p>Slot A</p>
            </div>
          </div>
        </div>
        <TableContainer {...props} />
        <br />
        <TableContainer {...props} />
        <br />
        <TableContainer {...props} />
      </div>
    </>
  );
}

export default Home;
