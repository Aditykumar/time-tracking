import React, {useState} from 'react'
const TaskDetail = ({ close ,task,TaskHandler ,setTimeSave,reset,taskDetail}) => {
    const [data, setData]=useState({title:"",desc:""})
    const closePopUP=()=>{
        close(false)
        TaskHandler()
        document.body.style.overflow = 'auto';

    }
const handleOnchange=(e)=>{
var name=e.target.name
var value=e.target.value
setData({...data,[name]:value,time:task})
}
console.log(data);
    const save=()=>{
        if(data.title!==""&& data.desc!==""){

        
        setTimeSave([...taskDetail,data])
        TaskHandler()
        reset()
        close(false)
        document.body.style.overflow = 'auto';

    }
    else{
        return(alert("Fill all the Fields"))
    }

    }


    return (
        <div className={'popUp'}>
            <div className={'blankPopUpTextBox'}>
                <div className={'closeIconBox'} onClick={closePopUP}></div>
                <div className={'textContainer' }>
                    <h1>Task Detail</h1>
                    <div className={'cardTitle'}> {task}</div>
                    <div className='inputGroup'>
                       
                        <input type="text" name="title" value={data.title} onChange={handleOnchange} placeholder="Title" required/>
                        <input type="text" name="desc" value={data.desc} onChange={handleOnchange} placeholder="Description" required />
                        </div>
                    <button className='saveBtn' onClick={save}>save</button>
                    <button onClick={closePopUP}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default TaskDetail