import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../Contexts/AuthContext';
import '../Styles/addTaskForm.sass';

const TaskForm = ({ toggleTaskForm, taskListChange }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [creationFailed, setCreationFailed] = useState(null);
  const [directories, setDirectories] = useState([]);

  useEffect(() => {
    const fetchDirectories = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`https://localhost:7226/api/Diretorios/Usuario/${user.id}/Nomes`);
          const data = await response.json();
          setDirectories(data);
        } catch (error) {
          console.error('Erro ao buscar diretórios:', error);
        }
      }
    };

    fetchDirectories();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7226/api/Tarefas/CriarTarefa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: data.titulo,
          descricao: data.descricao,
          prazo: data.prazo,
          prioridade: data.prioridade,
          finalizada: false,
          idDiretorio: data.idDiretorio,
          idUsuario: user.id
        })
      });

      const result = await response.json();
      if (result) {
        setCreationFailed(false);
        taskListChange();
      } else {
        setCreationFailed(true);
      }
    } catch (error) {
      setCreationFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='addTaskForm'>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <h2>Adicionar Tarefa</h2>
        <div>
          <input
            type="text"
            placeholder="Título"
            {...register('titulo', {
              required: 'Este campo é obrigatório',
              maxLength: {
                value: 12,
                message: 'O nome não pode ter mais que 12 caracteres'
              }
            })}
            required
          />
          {errors.titulo && <p>{errors.titulo.message}</p>}
        </div>
        <div>
          <textarea
            placeholder="Descrição"
            {...register('descricao', {
              required: 'Este campo é obrigatório',
            })}
            required
          />
          {errors.descricao && <p>{errors.descricao.message}</p>}
        </div>
        <div>
          <input
            type="date"
            {...register('prazo', {
              required: 'Este campo é obrigatório',
            })}
            required
          />
          {errors.prazo && <p>{errors.prazo.message}</p>}
        </div>
        <div>
          <select {...register('idDiretorio', { required: 'Este campo é obrigatório' })} required>
            <option value="">Selecione um diretório</option>
            {directories.map((dir) => (
              <option key={dir.id} value={dir.id}>{dir.nome}</option>
            ))}
          </select>
          {errors.idDiretorio && <p>{errors.idDiretorio.message}</p>}
        </div>
        <div className='checkboxContainer'>
          <label>
            <input
              type="checkbox"
              {...register('prioridade')}
            />
            <div className="custom-checkbox" />
            <span>Prioridade</span>
          </label>
        </div>
        {user && (
          <button className={isLoading ? 'loader' : ''} type="submit">
            {isLoading ? (
              <>
                <img src="../../../src/img/spinner-solid.svg" alt="Loading" />
              </>
            ) : (
              "CRIAR"
            )}
          </button>
        )}
        <img src="../../../src/img/xmark-solid-black.svg" onClick={toggleTaskForm} alt="Close" />
      </form>

      {creationFailed === true && <p className='popUp error'>
        Falha ao criar a tarefa.
        <img
          src="../../../src/img/xmark-solid.svg"
          onClick={() => { setCreationFailed(null) }}
          alt="Close"
        />
      </p>}
      {creationFailed === false && <p className='popUp success'>
        Tarefa criada com sucesso.
        <img
          src="../../../src/img/xmark-solid.svg"
          onClick={() => { setCreationFailed(null) }}
          alt="Close"
        />
      </p>}
    </div>
  );
};

export default TaskForm;
