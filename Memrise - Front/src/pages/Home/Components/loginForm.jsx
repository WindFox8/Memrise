import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../Contexts/AuthContext';
import '../Styles/forms.sass';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7226/api/Usuarios/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          senha: data.senha
        })
      });

      const result = await response.json();
      if (result && result.id) {
        login(result);
        console.log({login})
      } else {
        setLoginFailed(true);
      }
    } catch (error) {
      setLoginFailed(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  return (
    <>
      <h1>MEM<br/>RISE</h1>
      <h2>Login</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="email"
            pattern=".*"
            placeholder="Email"
            {...register('email', {
              required: 'Este campo é obrigatório',
            })}
            required
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            {...register('senha', {
              required: 'Este campo é obrigatório'
            })}
          />
          {errors.senha && <p>{errors.senha.message}</p>}
        </div>
        <button className={isLoading ? 'loader' : ''} type="submit">
          {isLoading ? (
            <>
              <img src="../../../src/img/spinner-solid.svg" alt="Loading"/>
            </>
          ) : (
            "LOGAR"
          )}
        </button>
      </form>
      {loginFailed && <p className="popUp error rightPopUpAdjust">
                        Email e/ou senha incorretos.
                        <img
                          src="../../../src/img/xmark-solid.svg"
                          onClick={() => {setLoginFailed(false);}}
                          alt="Close"
                        />
                      </p>}
    </>
  );
};

export default LoginForm;