import React from 'react';
import './home.css';
import Award from '../../img/award.svg';

function Home() {
  return (
    <>
    <div className='tdye'>
        <h3 className='tdhd'>Today's Exam</h3>
        <div className="vara"></div>
        <div className="tcwrap">
            <div className="tcard">
                <img src={Award} alt="hi" />
                <div className="cdet">
                    <h3>CS 21</h3>
                    <p>Slot A</p>
                </div>
            </div>
            <div className="tcard">
                <img src={Award} alt="hi" />
                <div className="cdet">
                    <h3>CS 21</h3>
                    <p>Slot A</p>
                </div>
            </div>
            <div className="tcard">
                <img src={Award} alt="hi" />
                <div className="cdet">
                    <h3>CS 21</h3>
                    <p>Slot A</p>
                </div>
            </div>
            <div className="tcard">
                <img src={Award} alt="hi" />
                <div className="cdet">
                    <h3>CS 21</h3>
                    <p>Slot A</p>
                </div>
            </div>
            <div className="tcard">
                <img src={Award} alt="hi" />
                <div className="cdet">
                    <h3>CS 21</h3>
                    <p>Slot A</p>
                </div>
            </div>
            <div className="tcard">
                <img src={Award} alt="hi" />
                <div className="cdet">
                    <h3>CS 21</h3>
                    <p>Slot A</p>
                </div>
            </div>
        </div>
        </div>
    </>
  )
}

export default Home;