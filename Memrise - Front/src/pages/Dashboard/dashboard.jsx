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
  const [showLeftAside, setShowLeftAside] = useState(false);
  const [showRightAside, setShowRightAside] = useState(false);

  const taskChange = () => {
    setTaskChange(!taskChanged);
  }

  const toggleLeftAside = () => {
    setShowLeftAside(!showLeftAside);
  }

  const toggleRightAside = () => {
    setShowRightAside(!showRightAside);
  }

  return (
    <div id='dashboard'>
      <LeftAside
        taskChange = {taskChange} 
        filter = {filter} 
        setFilter = {setFilter} 
        toggleLeftAside = {toggleLeftAside}
        showLeftAside = {showLeftAside}
      />
      <MainContent 
        taskChanged = {taskChanged} 
        filter = {filter} 
        setTodayTasks = {setTodayTasks} 
        setTotalTasks = {setTotalTasks} 
        setTasksFinished = {setTasksFinished} 
        toggleLeftAside = {toggleLeftAside}
        toggleRightAside = {toggleRightAside}
      />
      <RightAside
       todayTasks = {todayTasks} 
       totalTasks = {totalTasks} 
       tasksFinished = {tasksFinished} 
       toggleRightAside = {toggleRightAside}
       showRightAside = {showRightAside}
      />
    </div>
  );
}

export default Dashboard;
