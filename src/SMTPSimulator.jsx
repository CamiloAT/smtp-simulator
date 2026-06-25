import React, { useState } from 'react';
import {
    EmailConfiguration,
    SimulationControls,
    ProtocolSteps,
    CommunicationLog,
    ProtocolInfo
} from './components';

const SMTPSimulator = () => {
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
    {
      id: 1,
      name: 'HELO/EHLO',
      description: 'Saludo inicial del cliente al servidor',
      command: 'EHLO cliente.com',
      expectedResponse: '250-smtp.servidor.com Hello cliente.com\n250-SIZE 35882577\n250 AUTH LOGIN PLAIN',
      delay: 800
    },
    {
      id: 2,
      name: 'MAIL FROM',
      description: 'Especificar la dirección del remitente',
      command: `MAIL FROM:<${emailData.from}>`,
      expectedResponse: '250 OK',
      delay: 600
    },
    {
      id: 3,
      name: 'RCPT TO',
      description: 'Especificar la dirección del destinatario',
      command: `RCPT TO:<${emailData.to}>`,
      expectedResponse: '250 OK',
      delay: 600
    },
    {
      id: 4,
      name: 'DATA',
      description: 'Iniciar la transmisión del contenido del mensaje',
      command: 'DATA',
      expectedResponse: '354 Enter message, ending with "." on a line by itself',
      delay: 500
    },
    {
      id: 5,
      name: 'Contenido',
      description: 'Enviar el mensaje completo con headers',
      command: `From: ${emailData.from}\nTo: ${emailData.to}\nSubject: ${emailData.subject}\nDate: ${new Date().toUTCString()}\n\n${emailData.body}\n.`,
      expectedResponse: '250 OK: Message accepted for delivery',
      delay: 1200
    },
    {
      id: 6,
      name: 'QUIT',
      description: 'Cerrar la conexión SMTP',
      command: 'QUIT',
      expectedResponse: '221 smtp.servidor.com Service closing transmission channel',
      delay: 500
    }
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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 bg-indigo-600 shrink-0">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="SMTP Simulator" className="w-12 h-12" />
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Simulador SMTP</h1>
            <p className="text-xs text-indigo-200">Simple Mail Transfer Protocol</p>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition text-sm font-medium"
          onClick={() => window.location.href = '/simulator'}
        >
          Ir al Simulador
        </button>
      </header>

      <main className="flex-1 grid grid-cols-12 grid-rows-1 gap-4 p-4 min-h-0">
        <div className="col-span-3 flex flex-col gap-3 min-h-0 overflow-y-auto">
          <EmailConfiguration
            emailData={emailData}
            setEmailData={setEmailData}
            isRunning={isRunning}
          />
          <SimulationControls
            isRunning={isRunning}
            onStart={startSimulation}
            onReset={resetSimulation}
            connectionStatus={connectionStatus}
          />
        </div>

        <div className="col-span-5 min-h-0 overflow-y-auto">
          <ProtocolSteps
            steps={smtpSteps}
            currentStep={currentStep}
            isRunning={isRunning}
          />
        </div>

        <div className="col-span-4 flex flex-col gap-2 min-h-0">
          <CommunicationLog logs={logs} />
          <ProtocolInfo />
        </div>
      </main>
    </div>
  );
};

export default SMTPSimulator;
