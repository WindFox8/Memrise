import React, { useState } from 'react';
import LeftAside from './Components/leftAside.jsx';
import MainContent from './Components/mainContent.jsx';
import RightAside from './Components/rightAside.jsx';
import './Styles/dashboard.sass';

function Dashboard() {
  const [taskChanged, setTaskChange] = useState(false);
  const [filter, setFilter] = useState(2);
  const [todayTasks, setTodayTasks] = useState([]); 
  const [totalTasks, setTotalTasks] = useState(0); 
  const [tasksFinished, setTasksFinished] = useState(0); 

  const taskChange = () => {
    setTaskChange(!taskChanged);
  }

  return (
    <div id='dashboard'>
      <LeftAside taskChange={taskChange} filter={filter} setFilter={setFilter} />
      <MainContent 
        taskChanged={taskChanged} 
        filter={filter} 
        setTodayTasks={setTodayTasks} 
        setTotalTasks={setTotalTasks} 
        setTasksFinished={setTasksFinished} 
      />
      <RightAside todayTasks={todayTasks} totalTasks={totalTasks} tasksFinished={tasksFinished} />
    </div>
  );
}

export default Dashboard;
