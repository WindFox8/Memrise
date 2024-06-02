import CadastroForm from './Components/cadastroForm.jsx';
import LoginForm from './Components/loginForm.jsx';
import React, { useState } from 'react';
import './Styles/home.sass';

function Home() {
  const [position, setPosition] = useState(false);

  const toggleForm = () => {
    setPosition(!position);
  };


  return (
    <div id='home'>
      <div className='backLayer'>
        <section>
          <h3>Não possui uma conta?</h3>
          <button onClick={toggleForm}>CADASTRAR</button>
        </section>
        <section>
          <h3>Já possui uma conta?</h3>
          <button onClick={toggleForm}>LOGAR</button>
        </section>
      </div>
      <div className={`form ${position ? 'left' : 'right'}`}>
        {position ? <CadastroForm /> : <LoginForm />}
      </div>
    </div>
  );
}

export default Home;