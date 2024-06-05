import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';
import DirForm from './dirForm';
import EditDirForm from './EditDirForm';
import '../Styles/leftAside.sass';

function LeftAside({ taskChange, filter, setFilter }) {
  const [directories, setDirectories] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [showDirForm, setShowDirForm] = useState(false);
  const [dirUpdate, setDirUpdate] = useState(false);
  const [editDirId, setEditDirId] = useState(null);

  const toggleDirForm = () => {
    setShowDirForm(!showDirForm);
  };

  const dirListChange = () => {
    setDirUpdate(!dirUpdate);
  };

  useEffect(() => {
    const fetchDirectories = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`https://localhost:7226/api/Diretorios/Usuario/${user.id}/Nomes`);
          const data = await response.json();
          setDirectories(data);
        } catch (error) {
          console.error('Erro ao buscar diretórios:', error);
          setError('Erro ao carregar diretórios');
        }
      }
    };

    fetchDirectories();
  }, [user, dirUpdate]);

  const deleteDirectory = async (id) => {
    try {
      const response = await fetch(`https://localhost:7226/api/Diretorios/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        dirListChange();
        taskChange();
      } 
    } catch (error) {
      console.log('Erro ao deletar diretório:', error);
    }
  };

  const handleButtonClick = (key) => {
    setFilter(key);
  };

  return (
    <aside id='leftAside'>
      <h2>MEM<br/>RISER</h2>
      <nav>
        <button key={1} className={filter === 1 ? 'active' : ''} onClick={() => handleButtonClick(1)}>Tarefas do Dia</button>
        <button key={2} className={filter === 2 ? 'active' : ''} onClick={() => handleButtonClick(2)}>Todas as Tarefas</button>
        <button key={3} className={filter === 3 ? 'active' : ''} onClick={() => handleButtonClick(3)}>Tarefas Importantes</button>
        <button key={4} className={filter === 4 ? 'active' : ''} onClick={() => handleButtonClick(4)}>Tarefas Concluídas</button>
        <button key={5} className={filter === 5 ? 'active' : ''} onClick={() => handleButtonClick(5)}>Tarefas Pendentes</button>
      </nav>
      <details open>
        <summary>Diretórios</summary>
        {error && <p>Erro ao carregar diretórios: {error}</p>}
        {directories.length > 0 ? (
          <ul>
            {directories.map((dir) => (
              <li key={dir.id}>
                {dir.nome}
                <div>
                  {dir.nome !== 'main' && (
                    <>
                      <img
                        className='edit'
                        src="../../../src/img/pen-to-square-regular.svg"
                        alt="Editar"
                        onClick={() => setEditDirId(dir.id)}
                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                      />
                      {editDirId === dir.id && (
                        <EditDirForm
                          dirId={dir.id}
                          dirNome={dir.nome}
                          toggleEditForm={() => setEditDirId(null)}
                          dirListChange={dirListChange}
                          taskChange={taskChange}
                        />
                      )}
                      <img
                        className='delete'
                        src="../../../src/img/trash-can-regular.svg"
                        alt="Deletar"
                        onClick={() => deleteDirectory(dir.id)}
                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                      />
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !error && <p>Nenhum diretório encontrado.</p>
        )}
      </details>
      <button className='addDirBtn' onClick={toggleDirForm}>Novo Diretório</button>
      {showDirForm && <DirForm toggleDirForm={toggleDirForm} dirListChange={dirListChange} />}
    </aside>
  );
}

export default LeftAside;
