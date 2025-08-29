// components/LoginStepper/LoginStepper.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './LoginStepper.css';

const API_URL = 'http://localhost:8080/api';

export default function LoginStepper() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [newUserId, setNewUserId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        email: '', nome: '', telefone: '', cpf: '', dataNascimento: '', senha: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const clearMessagesAndFields = () => {
        setError('');
        setSuccess('');
        setFormData({ email: '', nome: '', telefone: '', cpf: '', dataNascimento: '', senha: '' });
    };

    const redirectToHome = () => {
        //IMPLEMENTAR REDRECIONAMENTO
        console.log('redirecionando');
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_URL}/usuarios/email/${formData.email}`);
            if (!response.ok) throw new Error('Erro no servidor.');
            const emailExists = await response.json();
            if (emailExists) {
                setStep(2);
            } else {
                setStep(3);
            }
        } catch (err) {
            setError('Não foi possível verificar o e-mail.');
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, senha: formData.senha }),
            });
            if (!response.ok) throw new Error(await response.text() || 'E-mail ou senha inválidos.');

            const loggedUser = await response.json();
            if (!loggedUser.cpf || !loggedUser.telefone) {
                setNewUserId(loggedUser.id);
                setFormData(loggedUser);
                setStep(4);
            } else {
                setSuccess(`Bem-vindo(a) de volta, ${loggedUser.nome}!`);
                redirectToHome();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const { nome, email, senha, dataNascimento, telefone } = formData;
        const novoUsuario = { nome, email, senha, dataNascimento, telefone, role: 'CLIENTE' };

        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoUsuario),
            });
            if (!response.ok) throw new Error('Erro ao tentar cadastrar.');

            const novoUsuarioCriado = await response.json();

            setFormData(novoUsuarioCriado);

            setNewUserId(novoUsuarioCriado.id);
            setSuccess('Cadastro realizado com sucesso! Complete seu perfil.');
            setStep(4);

        } catch (err) {
            setError('Não foi possível realizar o cadastro.');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        const dadosParaAtualizar = { cpf: formData.cpf };

        try {
            const response = await fetch(`${API_URL}/usuarios/${newUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaAtualizar),
            });
            if (!response.ok) throw new Error('Não foi possível atualizar o perfil.');

            setSuccess('Perfil atualizado com sucesso! Bem-vindo(a)!');
            redirectToHome();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBack = () => {
        setStep(1);
        setError('');
        setSuccess('');
        setFormData({
            email: '', nome: '', telefone: '', cpf: '', dataNascimento: '', senha: '',
        });
        setNewUserId(null);
    };

    const handleStepClick = (targetStep) => {
        if (targetStep === 1) {
            handleBack();
            return;
        }

        if (targetStep < step) {
            setError('');
            setSuccess('');
            setStep(targetStep);
        }
    };

    const Stepper = () => {
        if (step === 1 || step === 2) {
            return (
                <div className="stepper-container" style={{ width: '60%' }}>
                    <div className="step-wrapper">
                        <div
                            className={`step-circle ${step === 1 ? 'active' : 'completed'} clickable`}
                            onClick={() => handleStepClick(1)}
                        >
                            {step > 1 ? '✔' : '1'}
                        </div>
                    </div>
                    <div className={`step-line ${step > 1 ? 'completed' : ''}`}></div>
                    <div className="step-wrapper">
                        <div className={`step-circle ${step === 2 ? 'active' : ''}`}>2</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="stepper-container" style={{ width: '80%' }}>
                    <div className="step-wrapper">
                        <div className="step-circle completed clickable" onClick={() => handleStepClick(1)}>✔</div>
                    </div>
                    <div className="step-line completed"></div>
                    <div className="step-wrapper">
                        <div
                            className={`step-circle ${step === 3 ? 'active' : 'completed'} ${step > 3 ? 'clickable' : ''}`}
                            onClick={() => handleStepClick(3)}
                        >
                            {step > 3 ? '✔' : '2'}
                        </div>
                    </div>
                    <div className={`step-line ${step > 3 ? 'completed' : ''}`}></div>
                    <div className="step-wrapper">
                        <div className={`step-circle ${step === 4 ? 'active' : ''}`}>3</div>
                    </div>
                </div>
            );
        }
    };

    const renderStepContent = () => {
        if (step === 1) {
            return (
                <form onSubmit={handleEmailSubmit} className="login-form">
                    <h2>Acesse sua conta</h2>
                    <p>Informe seu e-mail para continuar.</p>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        required
                        className="login-input"
                    />
                    <button type="submit" className="login-button">Continuar</button>
                </form>
            );
        } else if (step === 2) {
            return (
                <form onSubmit={handleLoginSubmit} className="login-form">
                    <div className="form-header">
                        <button type="button" onClick={handleBack} className="back-button">←</button>
                        <h2>Olá novamente!</h2>
                    </div>
                    <p>Digite sua senha para acessar.</p>
                    <input
                        name="senha"
                        type="password"
                        value={formData.senha}
                        onChange={handleInputChange}
                        placeholder="Sua senha"
                        required
                        className="login-input"
                    />
                    <button type="submit" className="login-button">Entrar</button>
                </form>
            );
        } else if (step === 3) {
            const isRegistrationComplete = newUserId !== null;
            return (
                <form onSubmit={handleRegisterSubmit} className="login-form">
                    <div className="form-header">
                        {!isRegistrationComplete && (
                            <button type="button" onClick={handleBack} className="back-button">←</button>
                        )}
                        <h2>Crie sua conta</h2>
                    </div>
                    <p>Ótimo! Para criar sua conta, preencha os campos abaixo.</p>
                    <input
                        name="nome"
                        type="text"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Nome completo"
                        required
                        className="login-input"
                        disabled={isRegistrationComplete}
                    />
                    <input
                        name="telefone"
                        type="text"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        placeholder="Telefone"
                        required
                        className="login-input"
                        disabled={isRegistrationComplete}
                    />
                    <input
                        name="dataNascimento"
                        type="date"
                        value={formData.dataNascimento}
                        onChange={handleInputChange}
                        required
                        className="login-input"
                        disabled={isRegistrationComplete}
                    />
                    <input
                        name="senha"
                        type="password"
                        value={formData.senha}
                        onChange={handleInputChange}
                        placeholder="Crie uma senha"
                        required
                        className="login-input"
                        disabled={isRegistrationComplete}
                    />
                    <button type="submit" className="login-button" disabled={isRegistrationComplete}>Cadastrar e Acessar</button>
                </form>
            );
        } else if (step === 4) {
            return (
                <form onSubmit={handleUpdateProfile} className="login-form">
                    <div className="form-header"><h2>Complete seu Perfil</h2></div>
                    <p>Para oferecermos um atendimento personalizado, que tal preencher os campos opcionais abaixo?</p>
                    <input
                        name="cpf"
                        type="text"
                        value={formData.cpf || ''}
                        onChange={handleInputChange}
                        placeholder="CPF (Opcional)"
                        className="login-input"
                    />
                    <button type="submit" className="login-button">Finalizar e Entrar</button>
                </form>
            );
        }
        return null;
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <Stepper />
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                {renderStepContent()}
            </div>
        </div>
    );
}
