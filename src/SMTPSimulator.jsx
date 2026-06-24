import React, { useState, useEffect } from 'react';
import { Mail, Server, User, Clock, CheckCircle, XCircle, Play, Pause, RotateCcw, Info, Settings, Terminal, BookOpen } from 'lucide-react';

const EmailConfiguration = ({ emailData, setEmailData, isRunning }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
        <Settings className="mr-2 text-blue-600" size={20} />
        Configuración del Email
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">De:</label>
          <input
            type="email"
            value={emailData.from}
            onChange={(e) => setEmailData({...emailData, from: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isRunning}
            placeholder="usuario@cliente.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Para:</label>
          <input
            type="email"
            value={emailData.to}
            onChange={(e) => setEmailData({...emailData, to: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isRunning}
            placeholder="destino@servidor.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asunto:</label>
          <input
            type="text"
            value={emailData.subject}
            onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isRunning}
            placeholder="Asunto del mensaje"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje:</label>
          <textarea
            value={emailData.body}
            onChange={(e) => setEmailData({...emailData, body: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 transition-all resize-none"
            disabled={isRunning}
            placeholder="Contenido del mensaje..."
          />
        </div>
      </div>
    </div>
  );
};

const SimulationControls = ({ isRunning, onStart, onReset, connectionStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'disconnected': return 'Desconectado';
      default: return 'Sin estado';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center space-x-4">
          <Server className={`${getStatusColor(connectionStatus)}`} size={24} />
          <span className="text-sm font-medium">
            Estado de Conexión: <span className={`${getStatusColor(connectionStatus)} font-semibold`}>
              {getStatusText(connectionStatus)}
            </span>
          </span>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={onStart}
          disabled={isRunning}
          className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          <Play className="mr-2" size={20} />
          {isRunning ? 'Simulando...' : 'Iniciar Simulación'}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105"
          title="Resetear simulación"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

const ProtocolSteps = ({ steps, currentStep, isRunning }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
        <Info className="mr-2 text-blue-600" size={20} />
        Pasos del Protocolo SMTP
      </h2>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
              index === currentStep && isRunning
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : index < currentStep
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">{step.name}</span>
              {index < currentStep && !isRunning && (
                <CheckCircle className="text-green-500" size={18} />
              )}
              {index === currentStep && isRunning && (
                <Clock className="text-blue-500 animate-spin" size={18} />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
            <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-100 p-2 rounded">
              {step.command.split('\n')[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommunicationLog = ({ logs }) => {
  const getLogColor = (type) => {
    switch (type) {
      case 'client': return 'text-blue-700 bg-blue-50 border-l-blue-400';
      case 'server': return 'text-green-700 bg-green-50 border-l-green-400';
      case 'success': return 'text-green-800 bg-green-100 border-l-green-500';
      case 'error': return 'text-red-700 bg-red-50 border-l-red-400';
      default: return 'text-gray-700 bg-gray-50 border-l-gray-400';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'client': return '→';
      case 'server': return '←';
      case 'success': return '✓';
      case 'error': return '✗';
      default: return '•';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <Terminal className="mr-2 text-blue-600" size={20} />
        Log de Comunicación SMTP
      </h2>
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="h-80 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600">
          {logs.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <Terminal size={48} className="mx-auto mb-2 opacity-50" />
              <p>Esperando simulación...</p>
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border-l-4 ${getLogColor(log.type)} transition-all duration-200`}
              >
                <div className="flex items-start space-x-2">
                  <span className="font-mono text-xs mt-1 opacity-70">
                    {getLogIcon(log.type)}
                  </span>
                  <div className="flex-1">
                    <div className="font-mono text-sm whitespace-pre-wrap">{log.message}</div>
                    <div className="text-xs opacity-60 mt-1">{log.timestamp}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ProtocolInfo = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
        <BookOpen className="mr-2" size={20} />
        Información Técnica SMTP
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold">Puertos:</h4>
            <ul className="ml-4 space-y-1">
              <li>• 25 (estándar)</li>
              <li>• 587 (submission)</li>
              <li>• 465 (SSL/TLS)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Protocolo base:</h4>
            <p className="ml-4">TCP (Transmission Control Protocol)</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold">Comandos principales:</h4>
            <ul className="ml-4 space-y-1">
              <li>• HELO/EHLO - Saludo</li>
              <li>• MAIL FROM - Remitente</li>
              <li>• RCPT TO - Destinatario</li>
              <li>• DATA - Contenido</li>
              <li>• QUIT - Desconexión</li>
            </ul>
          </div>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-2">Códigos de respuesta:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-100 p-2 rounded">2xx: Éxito</div>
            <div className="bg-yellow-100 p-2 rounded">3xx: Acción requerida</div>
            <div className="bg-orange-100 p-2 rounded">4xx: Error temporal</div>
            <div className="bg-red-100 p-2 rounded">5xx: Error permanente</div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <Mail className="inline-block mr-4 text-blue-600" size={48} />
            Simulador SMTP
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Simple Mail Transfer Protocol - Protocolo de Transferencia de Correo
          </p>
          <p className="text-sm text-gray-500">
            Katlyn Galvis - Gabriel Cely - Diego Aguirre - Camilo Arias
          </p>
          <button
            className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.href = '/simulator'}
          >
            Ir al Simulador
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1 space-y-6">
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
            <ProtocolInfo />
          </div>
 
          <div className="xl:col-span-1">
            <ProtocolSteps 
              steps={smtpSteps} 
              currentStep={currentStep} 
              isRunning={isRunning} 
            />
          </div>

          <div className="xl:col-span-1">
            <CommunicationLog logs={logs} />
          </div>
        </div>

        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Simulador educativo del protocolo SMTP - Desarrollado para fines académicos
          </p>
        </div>
      </div>
    </div>
  );
};

export default SMTPSimulator;