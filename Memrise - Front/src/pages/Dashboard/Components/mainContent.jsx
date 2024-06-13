import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';
import TaskForm from './taskForm';
import EditTaskForm from './editTaskForm';
import '../Styles/mainContent.sass';

function MainContent({ taskChanged, filter, setTodayTasks, setTotalTasks, setTasksFinished }) {
  const { user } = useContext(AuthContext);
  const [tarefas, setTarefas] = useState([]);
  const [directories, setDirectories] = useState({});
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const date = new Date().toLocaleDateString();

  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
  };

  const fetchDirectories = async () => {
    if (user && user.id) {
      try {
        const response = await fetch(`https://localhost:7226/api/Diretorios/Usuario/${user.id}/Nomes`);
        const data = await response.json();
        const dirMap = {};
        data.forEach(dir => {
          dirMap[dir.id] = dir.nome;
        });
        setDirectories(dirMap);
      } catch (error) {
        console.error('Erro ao buscar diretórios:', error);
      }
    }
  };

  const fetchTarefas = async () => {
    setError(null);
    if (user && user.id) {
      try {
        const response = await fetch(`https://localhost:7226/api/Tarefas/Usuario/${user.id}`);
        const data = await response.json();
        setTarefas(data);

        const today = new Date().toLocaleDateString();
        const todayTasks = data.filter(tarefa => new Date(tarefa.prazo).toLocaleDateString() === today).map(tarefa => tarefa.titulo);
        const totalTasks = data.length;
        const tasksFinished = data.filter(tarefa => tarefa.finalizada).length;

        setTodayTasks(todayTasks);
        setTotalTasks(totalTasks);
        setTasksFinished(tasksFinished);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        setError('Você não possui tarefas no momento');
        setTarefas([]);
        setTodayTasks([]);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`https://localhost:7226/api/Tarefas/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchTarefas();
      }
    } catch (error) {
      console.log('Erro ao deletar tarefa:', error);
    }
  };

  const toggleTaskPriority = async (id) => {
    try {
      const response = await fetch(`https://localhost:7226/api/Tarefas/${id}/inverter-prioridade`, {
        method: 'PATCH'
      });
      if (response.ok) {
        fetchTarefas();
      }
    } catch (error) {
      console.log('Erro ao inverter prioridade da tarefa:', error);
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      const response = await fetch(`https://localhost:7226/api/Tarefas/${id}/inverter-finalizado`, {
        method: 'PATCH'
      });
      if (response.ok) {
        fetchTarefas();
      }
    } catch (error) {
      console.log('Erro ao inverter finalização da tarefa:', error);
    }
  };

  useEffect(() => {
    fetchDirectories();
    fetchTarefas();
  }, [user, taskChanged]);

  useEffect(() => {
    const filterTasks = () => {
      let filtered = tarefas;

      switch (filter) {
        case 1:
          filtered = tarefas.filter(tarefa => {
            const today = new Date().toLocaleDateString();
            const tarefaDate = new Date(tarefa.prazo).toLocaleDateString();
            return tarefaDate === today;
          });
          break;
        case 2:
          filtered = tarefas;
          break;
        case 3: 
          filtered = tarefas.filter(tarefa => tarefa.prioridade);
          break;
        case 4:
          filtered = tarefas.filter(tarefa => tarefa.finalizada);
          break;
        case 5:
          filtered = tarefas.filter(tarefa => !tarefa.finalizada);
          break;
        default:
          filtered = tarefas;
          break;
      }

      if (searchTerm) {
        filtered = filtered.filter(tarefa => 
          tarefa.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filtered;
    };

    setFilteredTasks(filterTasks());
  }, [filter, tarefas, searchTerm]);

  return (
    <main id="mainContent">
      <header>
        <input 
          type="text" 
          list="searchTarefas" 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
        <datalist id="searchTarefas">
          {filteredTasks.map(tarefa => (
            <option key={tarefa.id} value={tarefa.titulo} />
          ))}
        </datalist>
        <time dateTime={date}>{date}</time>
        <button className="addTaskBtn" onClick={toggleTaskForm}>Adicionar Tarefa</button>
      </header>
      <div className='tasksModule'>
        {error && <p className='error'>{error}</p>}
        {filteredTasks.length > 0 ? (
          <ul>
            {filteredTasks.slice().reverse().map(tarefa => (
              <li key={tarefa.id}>
                <h3>{tarefa.titulo}</h3>
                <p className='descricao'>{tarefa.descricao}</p>
                <div className='container'>
                  <p><img className='icon' src="../../../src/img/calendar-days-solid.svg" alt="Calendar" /> {new Date(tarefa.prazo).toLocaleDateString()}</p>
                  <div>
                    <p 
                      className={tarefa.finalizada ? 'finalizado' : 'pendente'}
                      onClick={() => toggleTaskCompletion(tarefa.id)}
                    >
                      {tarefa.finalizada ? 'Finalizada' : 'Pendente'}
                    </p>
                    <section>
                      <img
                        className='img-1'
                        src={tarefa.prioridade ? "../../../src/img/star-solid.svg" : "../../../src/img/star-regular.svg"}
                        alt={"Star"}
                        onClick={() => toggleTaskPriority(tarefa.id)}
                      />
                      <img
                        className='img-2'
                        src="../../../src/img/pen-to-square-regular.svg"
                        alt="Editar"
                        onClick={() => setEditingTask(tarefa)}
                      />
                      <img
                        className='img-3'
                        src="../../../src/img/trash-can-regular.svg"
                        alt="Deletar"
                        onClick={() => deleteTask(tarefa.id)}
                      />
                    </section>
                  </div>
                </div>
                <p className='directorieName'>{directories[tarefa.idDiretorio] || 'N/A'}</p>
              </li>
            ))}
          </ul>
        ) : (
          !error && <p className='noTask'>Nenhuma tarefa encontrada.</p>
        )}
      </div>
      {showTaskForm && <TaskForm toggleTaskForm={toggleTaskForm} taskListChange={fetchTarefas} />}
      {editingTask && (
        <EditTaskForm
          task={editingTask}
          closeForm={() => setEditingTask(null)}
          taskListChange={fetchTarefas}
        />
      )}
    </main>
  );
}

export default MainContent;
