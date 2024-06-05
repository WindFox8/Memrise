import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../Contexts/AuthContext';
import '../Styles/editDirForm.sass';

const EditDirForm = ({ dirId, dirNome, toggleEditForm, dirListChange }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { nome: dirNome }
  });
  const { user } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [editFailed, setEditFailed] = useState(null);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7226/api/Diretorios`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: dirId,
          nome: data.nome
        })
      });

      if (response.ok) {
        setEditFailed(false);
        dirListChange();
        toggleEditForm();
      } else {
        setEditFailed(true);
      }
    } catch (error) {
      setEditFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='editDirForm'>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <h2>Editar Diretório</h2>
        <div>
          <input
            type="text"
            placeholder="Nome do diretório"
            {...register('nome', {
              required: 'Este campo é obrigatório',
              maxLength: {
                value: 14,
                message: 'O nome não pode ter mais que 14 caracteres'
              }
            })}
            required
          />
          {errors.nome && <p>{errors.nome.message}</p>}
        </div>
        <button className={isLoading ? 'loader' : ''} type="submit">
          {isLoading ? (
            <>
              <img src="../../../src/img/spinner-solid.svg" alt="Loading"/>
            </>
          ) : (
            "EDITAR"
          )}
        </button>
        <img src="../../../src/img/xmark-solid.svg" onClick={toggleEditForm} alt="Close"/>
      </form>
      
      {editFailed === true && <p className='popUp error'>
                                Falha ao editar o diretório.
                                <img
                                  src="../../../src/img/xmark-solid.svg"
                                  onClick={() => {setEditFailed(null)}}
                                  alt="Close"
                                />
                              </p>}
      {editFailed === false && <p className='popUp success'>
                                Diretório editado com sucesso.
                                <img
                                  src="../../../src/img/xmark-solid.svg"
                                  onClick={() => {setEditFailed(null)}}
                                  alt="Close"
                                />
                              </p>}
    </div>
  );
};

export default EditDirForm;
