import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../Contexts/AuthContext';
import '../Styles/addDirForm.sass';

const DirForm = ({ toggleDirForm, dirListChange }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [creationFailed, setCreationFailed] = useState(null);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7226/api/Diretorios/CriarDiretorio/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: data.nome
        })
      });

      const result = await response.json();
      if (result === true) {
        setCreationFailed(false);
        dirListChange();
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
    <div className='addDirForm'>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <h2>Criar Diretório</h2>
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
        {isAuthenticated && (
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
        <img src="../../../src/img/xmark-solid.svg" onClick={toggleDirForm} alt="Close" />
      </form>
      
      {creationFailed === true && <p className='popUp error'>
                                    Falha ao criar o diretório
                                    <img
                                        src="../../../src/img/xmark-solid.svg"
                                        onClick={() => {setCreationFailed(null)}}
                                        alt="Close"
                                      />
                                  </p>}
      {creationFailed === false && <p className='popUp success'>
                                      Diretório criado com sucesso.
                                      <img
                                        src="../../../src/img/xmark-solid.svg"
                                        onClick={() => {setCreationFailed(null)}}
                                        alt="Close"
                                      />
                                    </p>}
    </div>
  );
};

export default DirForm;
