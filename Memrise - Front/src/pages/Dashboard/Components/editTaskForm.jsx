import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../Contexts/AuthContext';
import '../Styles/addTaskForm.sass';

const EditTaskForm = ({ task, closeForm, taskListChange }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      titulo: task.titulo,
      descricao: task.descricao,
      prazo: task.prazo.split('T')[0],
      prioridade: task.prioridade,
      finalizada: task.finalizada,
    }
  });
  const { user } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [updateFailed, setUpdateFailed] = useState(null);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7226/api/Tarefas/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          id: task.id
        })
      });

      const result = await response.json();
      if (result) {
        setUpdateFailed(false);
        taskListChange();
        closeForm();
      } else {
        setUpdateFailed(true);
      }
    } catch (error) {
      setUpdateFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='addTaskForm'>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <h2>Editar Tarefa</h2>
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
        <div className='checkboxContainer'>
          <label>
            <input
              type="checkbox"
              {...register('prioridade')}
            />
            <div className="custom-checkbox" />
            <span>Prioridade</span>
          </label>
          <label>
            <input
              type="checkbox"
              {...register('finalizada')}
            />
            <div className="custom-checkbox" />
            <span>Finalizada</span>
          </label>
        </div>
        {user && (
          <button className={isLoading ? 'loader' : ''} type="submit">
            {isLoading ? (
              <>
                <img src="../../../src/img/spinner-solid.svg" alt="Loading" />
              </>
            ) : (
              "ATUALIZAR"
            )}
          </button>
        )}
        <img src="../../../src/img/xmark-solid-black.svg" onClick={closeForm} alt="Close" />
      </form>

      {updateFailed === true && <p className='popUp error'>
        Falha ao atualizar a tarefa.
        <img
          src="../../../src/img/xmark-solid.svg"
          onClick={() => { setUpdateFailed(null) }}
          alt="Close"
        />
      </p>}
      {updateFailed === false && <p className='popUp success'>
        Tarefa atualizada com sucesso.
        <img
          src="../../../src/img/xmark-solid.svg"
          onClick={() => { setUpdateFailed(null) }}
          alt="Close"
        />
      </p>}
    </div>
  );
};

export default EditTaskForm;
