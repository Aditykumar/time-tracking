import React, { useEffect, useRef, useState, useCallback } from "react";
import TaskDetail from "./TaskDetail";
import deleteIcon from "../image/delete.png"

const useTimer = () => {

    const [showTime, setshowTime] = useState('00:00:00'),
        streamDuration = useRef(0),
        previousTime = useRef(0),
        timerSet = useRef(null),
        [isStartTimer, setIsStartTimer] = useState(false),
        [isStopTimer, setIsStopTimer] = useState(false),
        [isPauseTimer, setIsPauseTimer] = useState(false),
        [isResumeTimer, setIsResumeTimer] = useState(false),
        isStartBtnDisabled = isPauseTimer || isResumeTimer || isStartTimer,
        isStopBtnDisabled = !(isPauseTimer || isResumeTimer || isStartTimer),
        isPauseBtnDisabled = !(isStartTimer || (!isStartTimer && isResumeTimer)),
        isResumeBtnDisabled = !isPauseTimer;

    const updateTimer = useCallback(() => {
        let now = performance.now();
        let dt = now - previousTime.current;

        if (dt >= 1000) {
            streamDuration.current = streamDuration.current + Math.round(dt / 1000);
            const timeFormate = new Date(streamDuration.current * 1000)
                .toISOString()
                .substr(11, 8);
            setshowTime(timeFormate);
            previousTime.current = now;
        }
        timerSet.current = requestAnimationFrame(updateTimer);
    }, []);

    const startTimer = useCallback(() => {
        previousTime.current = performance.now();
        timerSet.current = requestAnimationFrame(updateTimer);
    }, [updateTimer]);

    useEffect(() => {
        if (isStartTimer && !isStopTimer) {
            startTimer();
        }
        if (isStopTimer && !isStartTimer) {
            streamDuration.current = 0;
            cancelAnimationFrame(timerSet.current);
            setshowTime('00:00:00');
        }
    }, [isStartTimer, isStopTimer, startTimer]);

    const startHandler = () => {
        setIsStartTimer(true);
        setIsStopTimer(false);
    };

    const stopHandler = () => {
        setIsStopTimer(true);
        setIsStartTimer(false);
        setIsPauseTimer(false);
        setIsResumeTimer(false);
    };


    const pauseHandler = () => {
        setIsPauseTimer(true);
        setIsStartTimer(false);
        setIsResumeTimer(false);
        cancelAnimationFrame(timerSet.current);
    };

    const resumeHandler = () => {
        setIsResumeTimer(true);
        setIsPauseTimer(false);
        startTimer();
    };

    return {
        showTime,
        isStartBtnDisabled,
        isStopBtnDisabled,
        isPauseBtnDisabled,
        isResumeBtnDisabled,
        startHandler,
        stopHandler,
        pauseHandler,
        resumeHandler,

    };
};

const TimerController = () => {
    const [showPopup, setShowPopUp] = useState(false)
    const [taskDetail, setTaskDetail] = useState([])
    const {
        showTime,
        isStartBtnDisabled,
        isStopBtnDisabled,
        isPauseBtnDisabled,
        isResumeBtnDisabled,
        startHandler,
        stopHandler,
        pauseHandler,
        resumeHandler,


    } = useTimer();
    const deleteFun = (index) => {
        var newData = taskDetail
        newData.splice(index, 1);
        setTaskDetail([...newData])
    }
    const showTask = () => {
        pauseHandler()
        setShowPopUp(true)
        document.body.style.overflow = 'hidden';

    }
    return (
        <>
            <div className="container">
                <div className="timerBox">{showTime}</div>
                <div className="buttonBox">
                    <button
                        onClick={startHandler}
                        disabled={isStartBtnDisabled}
                        className={'startBtn'}
                    >
                        start
                    </button>

                    <button
                        className={'stopBtn'}
                        disabled={isStopBtnDisabled}
                        onClick={showTask}
                    >
                        Save
                    </button>
                    <button
                        className={'pauseBtn'}
                        disabled={isPauseBtnDisabled}
                        onClick={pauseHandler}
                    >
                        pause
                    </button>
                    <button
                        className={'resumeBtn'}
                        disabled={isResumeBtnDisabled}
                        onClick={resumeHandler}
                    >
                        resume
                    </button>
                </div>
                {(taskDetail.length !== 0) &&
                    <div className="task">
                        <h4>Saved Task</h4>
                        <>
                            {taskDetail.map((value, index) => (

                                <div key={index} className="taskDetailBox">
                                    <div>{index+1}</div>
                                    <div className="title">{value.title}</div>
                                    <div><i>{value.desc}</i></div>
                                    <div className="time">{value.time}</div>
                                    <img className="deleteImg" onClick={() => deleteFun(index)} src={deleteIcon} alt="delete"/>
                                  
                                </div>

                            )
                            )}
                        </>
                    </div>
                }


            </div>
            {showPopup && <TaskDetail close={setShowPopUp}  taskDetail={taskDetail} reset={stopHandler} setTimeSave={setTaskDetail} task={showTime} TaskHandler={resumeHandler} />}
        </>
    );
};

export default TimerController 