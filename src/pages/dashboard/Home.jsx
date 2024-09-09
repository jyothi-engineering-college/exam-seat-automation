import '../../styles/home.css';

function Home() {
  return (
    <>
      <div className="tdye">
        <h3 className="tdhd">Today's Exam</h3>
        <div className="underline"></div>
        <div className="tcwrap">
          <div className="tcard">
            <img srcSet="../book.svg" alt="hi" />
            <div className="cdet">
              <h3>CS 21</h3>
              <p>Slot A</p>
            </div>
          </div>
          <div className="tcard">
            <img srcSet="../book.svg" alt="hi" />
            <div className="cdet">
              <h3>CS 21</h3>
              <p>Slot A</p>
            </div>
          </div>{" "}
          <div className="tcard">
            <img srcSet="../book.svg" alt="hi" />
            <div className="cdet">
              <h3>CS 21</h3>
              <p>Slot A</p>
            </div>
          </div>
          <div className="tcard">
            <img srcSet="../book.svg" alt="hi" />
            <div className="cdet">
              <h3>CS 21</h3>
              <p>Slot A</p>
            </div>
          </div>
          <div className="tcard">
            <img srcSet="../book.svg" alt="hi" />
            <div className="cdet">
              <h3>CS 21</h3>
              <p>Slot A</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;