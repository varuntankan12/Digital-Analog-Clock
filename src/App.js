import './styles/clock.css';
import React, { useEffect, useRef, useState } from 'react';
import tick from "./sound/tick.mp3";
import { MdLightMode, MdOutlineDarkMode } from "react-icons/md";

function App() {

    const numbref = useRef();
    const tickref = useRef();
    const hourref = useRef();
    const mintref = useRef();
    const secdref = useRef();
    const hidbref = useRef();
    const audiref = useRef();
    const waitref = useRef(waitFunction);
    const addnumberref = useRef(addNumbers);

    const [digitaltime, setDigitalTime] = useState("00 : 00 : 00");
    const [amorpm, setAmOrPm] = useState("--");
    const [digitaldate, setDigitalDate] = useState("DD-MM-YYYY");
    const [darkmode, setDarkMode] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [muted, setMuted] = useState(false);

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

    const formatTimeComponent = (component) => (component > 9 ? component : `0${component}`);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    const playSound = () => {
        setMuted(false);
        const audio = new Audio();
        audio.src = tick;
        audio.oncanplaythrough = (event) => {
            var playedPromise = audio.play();
            if (playedPromise) {
                playedPromise.catch((e) => {
                    if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
                        console.log(e.name);
                    }
                }).then(() => {

                });
            }
        }
    };

    function addNumbers(tag = '') {
        const numbersContainer = numbref.current;
        const tickcontainer = tickref.current;
        const radius = windowWidth > 540 ? 210 : 140;
        const tickradius = windowWidth > 540 ? 235 : 163;
        const horshift = -15;
        const vershift = -10;

        numbersContainer.innerHTML = '';
        tickcontainer.innerHTML = '';

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
            tick.className = `${tag}tick`;
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

            rotatehourhand === 0 ? hourstick.style.transition = "none" : hourstick.style.transition = "transform 1s ease";
            rotateminutehand === 0 ? minutstick.style.transition = "none" : minutstick.style.transition = "transform 1s ease";

            hourstick.style.transform = `translateY(-50%) rotate(${rotatehourhand}deg)`;
            minutstick.style.transform = `${windowWidth > 540 ? "translateY(-50%)" : "translate(-4%,-50%)"} rotate(${rotateminutehand}deg)`;
            secondstick.style.transform = `translateY(-50%) rotate(${rotatesecondhand}deg)`;

            const formattedHours = formatTimeComponent(hours % 12 === 0 ? 12 : hours % 12);
            const formattedMinutes = formatTimeComponent(minutes);
            const formattedSeconds = formatTimeComponent(seconds);

            setDigitalTime(`${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`);
            setAmOrPm(`${hours > 12 ? "PM" : "AM"}`);
            
            if (!muted) {
                playSound();
            }

        }, 1000);
    }

    function waitFunction() {
        setTimeout(() => {
            start();
            const popup = audiref.current
            popup.style.display = "none";
        }, 2000);
    }

    useEffect(() => {
        waitref.current();
        window.addEventListener('resize', handleResize);
        addnumberref.current("dark");
        hidbref.current.click();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    return (
        <div className={`${darkmode ? "dark" : "light"}`}>
            <div className="main dark:bg-[#071b24]">
                <button ref={hidbref} id="hiddenButton" style={{ display: 'none' }} onClick={playSound}></button>
                <div ref={audiref} className='popup'><p>Click to Play audio</p></div>
                <button onClick={() => { addNumbers(darkmode ? "" : "dark"); setDarkMode(!darkmode) }} className="absolute top-5 right-6 sm:right-8">{darkmode ? <MdLightMode className=" h-6 w-6 text-[#aef] sm:h-8 sm:w-8" /> : <MdOutlineDarkMode className="h-6 w-6 text-black sm:h-8 sm:w-8" />}</button>
                <div className="clockcontainer">
                    <div className="clockcircle">
                        <div ref={numbref} className="numbers dark:text-[#355a6a]"></div>
                        <div ref={tickref} className='ticks'></div>
                        <div ref={hourref} className="hour bg-black dark:bg-[#3b200a]">
                            <span className='hourleft'></span>
                            <span className='hourright'></span>
                        </div>
                        <div ref={mintref} className="minute dark:bg-[#eedddd]">
                            <span className='minuteleft'></span>
                            <span className='minuteright'></span>
                        </div>
                        <span ref={secdref} className="second"></span>
                    </div>
                </div>
                <div className='clockmanager'>
                    <div className="datecontainer dark:bg-[#9993721a]">
                        <span className="date dark:text-[#EEDDDD]">{digitaldate}</span>
                    </div>
                    <div className="">
                        <span className="timecontainer dark:text-[#EEDDDD] dark:bg-[#9993721a]">{digitaltime}</span>
                        <span className="amorpm dark:text-[#EEDDDD] dark:bg-[#9993721a]">{amorpm}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
