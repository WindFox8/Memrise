import React, { useContext } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';
import '../Styles/rightAside.sass';

function RightAside({ todayTasks, totalTasks, tasksFinished }) {
  const { user, setIsAuthenticated, setUser } = useContext(AuthContext);

  const completionRate = totalTasks > 0 ? (tasksFinished / totalTasks) * 100 : 0;

  const deleteAccount = async () => {
    if (window.confirm("Você tem certeza que deseja deletar sua conta?")) {
      try {
        const response = await fetch(`https://localhost:7226/api/Usuarios/${user.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Conta deletada com sucesso.');
          logout();
        } else {
          alert('Erro ao deletar a conta.');
        }
      } catch (error) {
        console.error('Erro ao deletar a conta:', error);
        alert('Erro ao deletar a conta.');
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <aside id="rightAside">
      <h2>Olá,<br />{user.nome}</h2>
      <button className="logout-btn" onClick={logout}>
        Deslogar
      </button>
      <div className="progress-bar-container">
        <label htmlFor="progress-bar">Tarefas Completas:</label>
        <div className="progress-bar">
          <div
            className="progress-bar-filled"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p>{tasksFinished} de {totalTasks} tarefas finalizadas</p>
      </div>
      <div className="today-tasks">
        <h3>Tarefas para Hoje</h3>
        {todayTasks.length > 0 ? (
          <ul>
            {todayTasks.map((task, index) => (
              <li key={index}>- {task}</li>
            ))}
          </ul>
        ) : (
          <p>Sem tarefas para hoje.</p>
        )}
      </div>
      <button className="delete-account-btn" onClick={deleteAccount}>
        Deletar Conta
      </button>
    </aside>
  );
}

export default RightAside;
