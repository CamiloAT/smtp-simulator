import { useState } from 'react';

export const useSmtpSimulation = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [logs, setLogs] = useState([]);
    const [emailData, setEmailData] = useState({
        from: 'usuario@cliente.com',
        to: 'destino@servidor.com',
        subject: 'Prueba de SMTP',
        body: 'Este es un mensaje de prueba para el simulador SMTP.'
    });
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    const smtpSteps = [
        {
            id: 0,
            name: 'Conexión TCP',
            description: 'Establecer conexión TCP en puerto 25',
            command: 'TCP Connect to smtp.servidor.com:25',
            expectedResponse: '220 smtp.servidor.com ESMTP Ready',
            delay: 1000
        },
        // ...existing steps...
    ];

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { message, type, timestamp }]);
    };

    const simulateStep = async (stepIndex) => {
        const step = smtpSteps[stepIndex];
        addLog(`${step.command}`, 'client');
        await new Promise(resolve => setTimeout(resolve, step.delay));
        addLog(`${step.expectedResponse}`, 'server');

        if (stepIndex === 0) {
            setConnectionStatus('connected');
        } else if (stepIndex === smtpSteps.length - 1) {
            setConnectionStatus('disconnected');
            addLog('✅ Email enviado exitosamente', 'success');
        }
    };

    const startSimulation = async () => {
        if (isRunning) return;

        setIsRunning(true);
        setCurrentStep(0);
        setLogs([]);
        setConnectionStatus('connecting');

        addLog('🚀 Iniciando simulación del protocolo SMTP...', 'info');

        for (let i = 0; i < smtpSteps.length; i++) {
            setCurrentStep(i);
            await simulateStep(i);
            await new Promise(resolve => setTimeout(resolve, 400));
        }

        setIsRunning(false);
        addLog('✨ Simulación completada exitosamente', 'success');
    };

    const resetSimulation = () => {
        setIsRunning(false);
        setCurrentStep(0);
        setLogs([]);
        setConnectionStatus('disconnected');
    };

    return {
        isRunning,
        currentStep,
        logs,
        emailData,
        connectionStatus,
        smtpSteps,
        setEmailData,
        startSimulation,
        resetSimulation
    };
};

export default useSmtpSimulation;
