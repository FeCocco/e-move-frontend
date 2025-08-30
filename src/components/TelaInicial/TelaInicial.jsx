import React from 'react';
import './TelaInicial.css';

const TelaInicial = ({ onStart }) => {
    return (
        <div id="welcomeScreen" className="active">
            <div className="welcome-overlay"></div>
            <div className="welcome-content">
                <h1 className="logo">
                    <span className="logo-e">e</span>-Move
                </h1>
                <p>Planejamento Inteligente para a sua Jornada Elétrica</p>
                <button className="btn-iniciar" onClick={onStart}>
                    Iniciar Jornada
                </button>
                <ul className="social-icons-welcome">
                    <li>
                        <a href="#" aria-label="Instagram">
                            <i className="fab fa-instagram icon"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#" aria-label="Suporte Técnico">
                            <i className="fas fa-headset icon"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#" aria-label="Email">
                            <i className="fas fa-envelope icon"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}; export default TelaInicial;