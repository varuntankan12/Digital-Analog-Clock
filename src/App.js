import './styles/clock.css';
import React, { useEffect, useRef, useState } from 'react';

function App() {

    const numbref = useRef();
    const tickref = useRef();
    const hourref = useRef();
    const mintref = useRef();
    const secdref = useRef();
    const waitref = useRef(waitFunction);
    const addnumberref = useRef(addNumbers);

    const [digitaltime, setDigitalTime] = useState("00 : 00 : 00");
    const [amorpm, setAmOrPm] = useState("--");
    const [digitaldate, setDigitalDate] = useState("DD-MM-YYYY");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const monthObj = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "June",
        7: "July",
        8: "Aug",
        9: "Sept",
        10: "Oct",
        11: "Nov",
        12: "Dec"
    };

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    function addNumbers() {
        const numbersContainer = numbref.current;
        const tickcontainer = tickref.current;
        const radius = windowWidth > 540 ? 210 : 140;
        const tickradius = windowWidth > 540 ? 235 : 163;
        const horshift = -15;
        const vershift = -10;

        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30) * (Math.PI / 180);
            const x = Math.round(radius * Math.cos(angle));
            const y = Math.round(radius * Math.sin(angle));

            const number = document.createElement("span");
            number.className = "number";
            number.style.left = `${x + horshift}px`;
            number.style.top = `${y + vershift}px`;
            number.style.lineHeight = "24px";
            number.textContent = i;

            numbersContainer.appendChild(number);
        }

        for (let i = 1; i <= 60; i++) {
            const angle = (i * 6) * (Math.PI / 180);
            const x = Math.round(tickradius * Math.cos(angle));
            const y = Math.round(tickradius * Math.sin(angle));

            const tick = document.createElement("span");
            tick.className = "tick";
            tick.style.left = `${x - 4}px`;
            tick.style.top = `${y - 2}px`;
            tick.style.transform = `rotate(${i * 6}deg)`;
            tickcontainer.appendChild(tick);
        }
    }

    function start() {
        const getdate = new Date();
        const d = getdate.getDate();
        const m = getdate.getMonth();
        const y = getdate.getFullYear();
        console.log(d, m, y);
        setDigitalDate(`${d}-${monthObj[m + 1]}-${y}`);

        setInterval(() => {
            const date = new Date();
            const hourstick = hourref.current;
            const minutstick = mintref.current;
            const secondstick = secdref.current;

            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const rotatehourhand = 30 * hours + minutes / 2;
            const rotateminutehand = 6 * minutes;
            const rotatesecondhand = 6 * seconds;

            hourstick.style.transform = `translateY(-50%) rotate(${rotatehourhand}deg)`;
            minutstick.style.transform = `${windowWidth > 540 ? "translateY(-50%)" : "translate(-4%,-50%)"} rotate(${rotateminutehand}deg)`;
            secondstick.style.transform = `translateY(-50%) rotate(${rotatesecondhand}deg)`;

            setDigitalTime(`${hours > 12 ? ((hours % 12 || 12) > 9 ? (hours % 12 || 12) : "0" + (hours % 12 || 12)) : (hours > 9 ? hours : "0" + hours)} : ${minutes > 9 ? minutes : "0" + minutes} : ${seconds > 9 ? seconds : "0" + seconds}`);
            setAmOrPm(`${hours > 12 ? "PM" : "AM"}`);
        }, 1000);
    }

    function waitFunction() {
        setTimeout(() => {
            start();
        }, 1000);
    }

    useEffect(() => {
        waitref.current();
        window.addEventListener('resize', handleResize);
        addnumberref.current();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    return (
        <div className="main">
            <div className="clockcontainer">
                <div className="clockcircle">
                    <div ref={numbref} className="numbers"></div>
                    <div ref={tickref} className='ticks'></div>
                    <div ref={hourref} className="hour">
                        <span className='hourleft'></span>
                        <span className='hourright'></span>
                    </div>
                    <div ref={mintref} className="minute">
                        <span className='minuteleft'></span>
                        <span className='minuteright'></span>
                    </div>
                    <span ref={secdref} className="second"></span>
                </div>
            </div>
            <div className='clockmanager'>
                <div className="datecontainer">
                    <span className="date">{digitaldate}</span>
                </div>
                <div className="">
                    <span className="timecontainer">{digitaltime}</span>
                    <span className="amorpm">{amorpm}</span>
                </div>
            </div>
        </div>
    );
}

export default App;
