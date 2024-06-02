// src/pages/Home.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import '../Styles/forms.sass';

const CadastroForm = () => {
  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm();
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const senha = watch('senha');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7226/api/Usuarios/Cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          senha: data.senha,
          nome: data.nome
        })
      });

      const result = await response.json();
      setRegisterSuccess(result === true);
    } catch (error) {
      setRegisterSuccess(false);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`https://localhost:7226/api/Usuarios/VerificarEmail?email=${email}`);
      const exists = await response.json();
      if (exists) {
        setError('email', { type: 'manual', message: 'Email já cadastrado' });
      }
    } catch (error) {
      console.error('Erro ao verificar o email:', error);
    } 
  };

  return (
    <>
      <h1>MEM<br/>RISE</h1>
      <h2>Cadastro</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="Nome"
            {...register('nome', {
              required: 'Este campo é obrigatório',
              maxLength: { value: 16, message: 'Nome não pode ter mais de 16 caracteres' },
              pattern: { value: /^[A-Za-z]+$/, message: 'Nome não pode conter números ou caracteres especiais' }
            })}
          />
          {errors.nome && <p>{errors.nome.message}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email', {
              required: 'Este campo é obrigatório',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Formato de email inválido' },
              validate: async (value) => await checkEmailExists(value)
            })}
            onBlur={() => checkEmailExists(watch('email'))}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            {...register('senha', {
              required: 'Este campo é obrigatório',
              minLength: { value: 8, message: 'A senha deve ter pelo menos 8 caracteres' },
              pattern: { value: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, message: 'A senha deve conter 1 letra maiúscula, 1 número e 1 símbolo' }
            })}
          />
          {errors.senha && <p>{errors.senha.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirmar Senha"
            {...register('confirmarSenha', {
              required: 'Este campo é obrigatório',
              validate: value => value === senha || 'As senhas não coincidem'
            })}
          />
          {errors.confirmarSenha && <p>{errors.confirmarSenha.message}</p>}
        </div>
        <button className={isLoading ? 'loader' : ''} type="submit">
          {isLoading ? (
            <>
              <img src="../../../src/img/spinner-solid.svg" alt="Loading"/>
            </>
          ) : (
            "CADASTRAR"
          )}
        </button>
      </form>
      {registerSuccess === true &&  <p className='popUp success leftPopUpAdjust'>
                                      Cadastro efetuado com sucesso.
                                      <img
                                        src="../../../src/img/xmark-solid.svg"
                                        onClick={() => {setRegisterSuccess(null)}}
                                        alt="Close"
                                      />
                                    </p>}
      {registerSuccess === false && <p className='popUp error leftPopUpAdjust'>
                                      Ocorreu um erro durante o cadastro.
                                      <img
                                        src="../../../src/img/xmark-solid.svg"
                                        onClick={() => {setRegisterSuccess(null)}}
                                        alt="Close"
                                      />
                                    </p>}
    </>
  );
};

export default CadastroForm;
