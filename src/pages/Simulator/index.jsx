import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Server, Monitor, Cable, Settings, Plus, X, Play, RefreshCcw, Pause, Square, MousePointer, AlertTriangle, GripVertical, Zap, Wrench, Terminal } from 'lucide-react';
import { CommunicationLog } from '../../components';
import LoadingScreen from '../../components/LoadingScreen';

const AlertNotification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        error: 'bg-red-50 border-red-400 text-red-800',
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
        success: 'bg-green-50 border-green-400 text-green-800',
        info: 'bg-blue-50 border-blue-400 text-blue-800',
    };

    const icons = {
        error: <AlertTriangle size={18} />,
        warning: <AlertTriangle size={18} />,
        success: <Zap size={18} />,
        info: <Zap size={18} />,
    };

    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-lg border-l-4 shadow-lg ${styles[type] || styles.info} animate-slide-down`}>
            {icons[type] || icons.info}
            <span className="text-sm font-medium flex-1">{message}</span>
            <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
                <X size={16} />
            </button>
        </div>
    );
};

const EmailConfigScreen = ({ emailData, setEmailData, onSend, onCancel, initialClients, finalClients, isRunning }) => {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center mb-4">
                    <Settings className="mr-2 text-blue-600" size={20} />
                    <h2 className="text-lg font-bold text-gray-800">Configuración del Email</h2>
                </div>
                
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">De:</label>
                        <select
                            value={emailData.from}
                            onChange={(e) => setEmailData(prev => ({...prev, from: e.target.value}))}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {initialClients.map(client => (
                                <option key={client} value={client}>{client}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Para:</label>
                        <select
                            value={emailData.to}
                            onChange={(e) => setEmailData(prev => ({...prev, to: e.target.value}))}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {finalClients.map(client => (
                                <option key={client} value={client}>{client}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Asunto:</label>
                        <input
                            type="text"
                            value={emailData.subject}
                            onChange={(e) => setEmailData(prev => ({...prev, subject: e.target.value}))}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Mensaje:</label>
                        <textarea
                            value={emailData.message}
                            onChange={(e) => setEmailData(prev => ({...prev, message: e.target.value}))}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-1.5 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500 transition duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onSend}
                            className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition duration-200"
                            disabled={!emailData.from || !emailData.to || isRunning}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DynamicSimulator = () => {
    const [elements, setElements] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedTool, setSelectedTool] = useState(null);
    const [draggedElement, setDraggedElement] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStart, setConnectionStart] = useState(null);
    const [configModal, setConfigModal] = useState(null);
    const canvasRef = useRef(null);
    const simulationAbortRef = useRef(false);
    const [simulationStatus, setSimulationStatus] = useState('disconnected');
    const [showEmailConfig, setShowEmailConfig] = useState(false);
    const [emailData, setEmailData] = useState({
        from: '',
        to: '',
        subject: '',
        message: ''
    });
    const [logs, setLogs] = useState([]);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleNavigateHome = useCallback(() => setLoading(true), []);
    const handleLoadComplete = useCallback(() => { window.location.href = '/'; }, []);

    const tools = [
        { id: 'client', name: 'Cliente SMTP', icon: Monitor, color: 'bg-blue-500' },
        { id: 'server', name: 'Servidor SMTP', icon: Server, color: 'bg-green-500' },
    ];

    const validateSimulationStructure = () => {
        if (elements.length === 0 || connections.length === 0) {
            addLog('Debe haber al menos un cliente, un servidor y una conexión.', 'error');
            return { isValid: false, message: 'Debe haber al menos un cliente, un servidor y una conexión.' };
        }

        const clients = elements.filter(e => e.type === 'client');
        const servers = elements.filter(e => e.type === 'server');

        if (clients.length === 0) {
            addLog('Debe haber al menos un cliente.', 'error');
            return { isValid: false, message: 'Debe haber al menos un cliente.' };
        }
        if (servers.length === 0) {
            addLog('Debe haber al menos un servidor.', 'error');
            return { isValid: false, message: 'Debe haber al menos un servidor.' };
        }

        const getElementById = (id) => elements.find(el => el.id === id);
        const getConnectionsFrom = (id) => connections.filter(conn => conn.from === id);
        const getConnectionsTo = (id => connections.filter(conn => conn.to === id));

        const possibleFirstServers = servers.filter(server => {
            const incomingConns = getConnectionsTo(server.id);
            const outgoingConns = getConnectionsFrom(server.id);

            const allIncomingFromClients = incomingConns.every(conn => getElementById(conn.from)?.type === 'client');
            const allOutgoingToServers = outgoingConns.every(conn => getElementById(conn.to)?.type === 'server');

            return allIncomingFromClients && allOutgoingToServers && incomingConns.length > 0 && outgoingConns.length > 0;
        });

        if (possibleFirstServers.length !== 1) {
            addLog('Debe haber exactamente un servidor principal (Server A) que solo reciba de clientes y solo envíe a otros servidores.', 'error');
            return { isValid: false, message: 'Debe haber exactamente un servidor principal (Server A) que solo reciba de clientes y solo envíe a otros servidores.' };
        }
        const firstServer = possibleFirstServers[0];
        addLog(`Primer servidor identificado: ${firstServer.name} (${firstServer.config.domain})`, 'success');

        const initialClients = clients.filter(client => getConnectionsFrom(client.id).some(conn => conn.to === firstServer.id));
        if (initialClients.length === 0) {
            addLog('Debe haber al menos un cliente inicial conectado al servidor principal.', 'error');
            return { isValid: false, message: 'Debe haber al menos un cliente inicial conectado al servidor principal.' };
        }
        addLog(`Clientes iniciales identificados: ${initialClients.map(c => c.name).join(', ')}`, 'success');

        for (const client of initialClients) {
            const clientOutgoing = getConnectionsFrom(client.id);
            const clientIncoming = getConnectionsTo(client.id);
            if (clientIncoming.length > 0) {
                addLog(`El cliente inicial ${client.name} no debe tener conexiones entrantes.`, 'error');
                return { isValid: false, message: `El cliente inicial ${client.name} no debe tener conexiones entrantes.` };
            }
            if (clientOutgoing.length !== 1 || clientOutgoing[0].to !== firstServer.id) {
                addLog(`El cliente inicial ${client.name} debe tener exactamente una conexión saliente al servidor principal.`, 'error');
                return { isValid: false, message: `El cliente inicial ${client.name} debe tener exactamente una conexión saliente al servidor principal.` };
            }
        }

        const intermediateServers = servers.filter(server => server.id !== firstServer.id);
        if (intermediateServers.length === 0) {
            addLog('Debe haber al menos un servidor intermedio conectado al servidor principal.', 'error');
            return { isValid: false, message: 'Debe haber al menos un servidor intermedio conectado al servidor principal.' };
        }
        addLog(`Servidores intermedios identificados: ${intermediateServers.map(s => s.name).join(', ')}`, 'success');

        let foundFinalClient = false;
        for (const server of intermediateServers) {
            const incomingConns = getConnectionsTo(server.id);
            const outgoingConns = getConnectionsFrom(server.id);

            if (incomingConns.length !== 1 || incomingConns[0].from !== firstServer.id) {
                addLog(`El servidor intermedio ${server.name} debe recibir exactamente una conexión del servidor principal.`, 'error');
                return { isValid: false, message: `El servidor intermedio ${server.name} debe recibir exactamente una conexión del servidor principal.` };
            }

            const allOutgoingToClients = outgoingConns.every(conn => getElementById(conn.to)?.type === 'client');
            if (!allOutgoingToClients || outgoingConns.length === 0) {
                addLog(`El servidor intermedio ${server.name} debe enviar conexiones solo a clientes finales y al menos a uno.`, 'error');
                return { isValid: false, message: `El servidor intermedio ${server.name} debe enviar conexiones solo a clientes finales y al menos a uno.` };
            }

            const clientsConnectedToThisServer = outgoingConns.map(conn => getElementById(conn.to));
            for (const client of clientsConnectedToThisServer) {
                if (client.type !== 'client') {
                    addLog(`El servidor intermedio ${server.name} tiene una conexión saliente a un no-cliente.`, 'error');
                    return { isValid: false, message: `El servidor intermedio ${server.name} tiene una conexión saliente a un no-cliente.` };
                }
                const clientOutgoing = getConnectionsFrom(client.id);
                if (clientOutgoing.length > 0) {
                    addLog(`El cliente final ${client.name} no debe tener conexiones salientes.`, 'error');
                    return { isValid: false, message: `El cliente final ${client.name} no debe tener conexiones salientes.` };
                }
                foundFinalClient = true;
            }
        }

        if (!foundFinalClient) {
            addLog('No se encontraron clientes finales válidos conectados a los servidores intermedios.', 'error');
            return { isValid: false, message: 'No se encontraron clientes finales válidos conectados a los servidores intermedios.' };
        }
        addLog('Se encontraron clientes finales válidos.', 'success');

        const allConnectedElementIds = new Set();
        elements.forEach(el => {
            const hasIncoming = connections.some(conn => conn.to === el.id);
            const hasOutgoing = connections.some(conn => conn.from === el.id);
            if (hasIncoming || hasOutgoing) {
                allConnectedElementIds.add(el.id);
            }
        });

        for (const el of elements) {
            const isInitialClient = initialClients.some(c => c.id === el.id);
            const isFirstServer = el.id === firstServer.id;
            const isIntermediateServer = intermediateServers.some(s => s.id === el.id);
            const isFinalClient = clients.some(c => {
                const incoming = getConnectionsTo(c.id);
                return incoming.some(conn => intermediateServers.some(s => s.id === conn.from)) && getConnectionsFrom(c.id).length === 0;
            });

            if (!(isInitialClient || isFirstServer || isIntermediateServer || isFinalClient)) {
                const hasAnyConnection = connections.some(conn => conn.from === el.id || conn.to === el.id);
                if (hasAnyConnection) {
                    addLog(`El elemento '${el.name}' está conectado de forma inesperada o no encaja en la estructura de simulación esperada.`, 'error');
                    return { isValid: false, message: `El elemento '${el.name}' está conectado de forma inesperada o no encaja en la estructura de simulación esperada.` };
                }
            }
        }

        addLog('Estructura de simulación validada correctamente.', 'success');
        return { isValid: true, message: 'Estructura de simulación válida.' };
    };

    const getInitialClients = () => {
        const elementMap = new Map(elements.map(el => [el.id, el]));
        
        const firstServer = elements.find(server => {
            if (server.type !== 'server') return false;
            
            const incomingConns = connections.filter(conn => conn.to === server.id);
            const outgoingConns = connections.filter(conn => conn.from === server.id);
            
            const incomingFromClients = incomingConns.filter(conn => elementMap.get(conn.from)?.type === 'client');
            const incomingFromServers = incomingConns.filter(conn => elementMap.get(conn.from)?.type === 'server');
            const outgoingToServers = outgoingConns.filter(conn => elementMap.get(conn.to)?.type === 'server');
            const outgoingToClients = outgoingConns.filter(conn => elementMap.get(conn.to)?.type === 'client');
            
            return incomingFromClients.length > 0 && incomingFromServers.length === 0 && 
                   outgoingToServers.length > 0 && outgoingToClients.length === 0;
        });
        
        if (!firstServer) {
            return [];
        }
        
        const initialClients = [];
        connections.filter(conn => conn.to === firstServer.id && elementMap.get(conn.from)?.type === 'client')
                  .forEach(conn => {
                      const client = elementMap.get(conn.from);
                      if (client && client.config.nickname && client.config.domain) {
                          initialClients.push(`${client.config.nickname}${client.config.domain}`);
                      }
                  });
        
        return initialClients;
    };
    
    const getFinalClients = () => {
        const elementMap = new Map(elements.map(el => [el.id, el]));
        
        // Encontrar el primer servidor
        const firstServer = elements.find(server => {
            if (server.type !== 'server') return false;
            
            const incomingConns = connections.filter(conn => conn.to === server.id);
            const outgoingConns = connections.filter(conn => conn.from === server.id);
            
            const incomingFromClients = incomingConns.filter(conn => elementMap.get(conn.from)?.type === 'client');
            const incomingFromServers = incomingConns.filter(conn => elementMap.get(conn.from)?.type === 'server');
            const outgoingToServers = outgoingConns.filter(conn => elementMap.get(conn.to)?.type === 'server');
            const outgoingToClients = outgoingConns.filter(conn => elementMap.get(conn.to)?.type === 'client');
            
            return incomingFromClients.length > 0 && incomingFromServers.length === 0 && 
                   outgoingToServers.length > 0 && outgoingToClients.length === 0;
        });
        
        if (!firstServer) {
            return [];
        }
        
        const finalClients = [];
        
        const intermediateServersConnections = connections.filter(conn => conn.from === firstServer.id);
        
        intermediateServersConnections.forEach(conn => {
            const intermediateServer = elementMap.get(conn.to);
            if (intermediateServer && intermediateServer.type === 'server') {
                connections.filter(finalConn => 
                    finalConn.from === intermediateServer.id && elementMap.get(finalConn.to)?.type === 'client'
                ).forEach(finalConn => {
                    const finalClient = elementMap.get(finalConn.to);
                    if (finalClient && finalClient.config.nickname && finalClient.config.domain) {
                        finalClients.push(`${finalClient.config.nickname}${finalClient.config.domain}`);
                    }
                });
            }
        });
        
        return finalClients;
    };
    

    const startSimulation = () => {
        prepareEmailOptions();
        setShowEmailConfig(true);
    };

    const prepareEmailOptions = () => {
        const elementMap = new Map(elements.map(el => [el.id, el]));
        
        const initialClients = [];
        const finalClients = [];
        
        const firstServer = elements.find(server => {
            if (server.type !== 'server') return false;
            
            const incomingConns = connections.filter(conn => conn.to === server.id);
            const outgoingConns = connections.filter(conn => conn.from === server.id);
            
            const incomingFromClients = incomingConns.filter(conn => elementMap.get(conn.from)?.type === 'client');
            const incomingFromServers = incomingConns.filter(conn => elementMap.get(conn.from)?.type === 'server');
            const outgoingToServers = outgoingConns.filter(conn => elementMap.get(conn.to)?.type === 'server');
            const outgoingToClients = outgoingConns.filter(conn => elementMap.get(conn.to)?.type === 'client');
            
            return incomingFromClients.length > 0 && incomingFromServers.length === 0 && 
                   outgoingToServers.length > 0 && outgoingToClients.length === 0;
        });
        
        connections.filter(conn => conn.to === firstServer.id && elementMap.get(conn.from)?.type === 'client')
                  .forEach(conn => {
                      const client = elementMap.get(conn.from);
                      if (client) {
                          initialClients.push(`${client.config.nickname}${client.config.domain}`);
                      }
                  });
        
        const intermediateServersConnections = connections.filter(conn => conn.from === firstServer.id);
        intermediateServersConnections.forEach(conn => {
            const intermediateServer = elementMap.get(conn.to);
            if (intermediateServer && intermediateServer.type === 'server') {
                connections.filter(finalConn => 
                    finalConn.from === intermediateServer.id && elementMap.get(finalConn.to)?.type === 'client'
                ).forEach(finalConn => {
                    const finalClient = elementMap.get(finalConn.to);
                    if (finalClient) {
                        finalClients.push(`${finalClient.config.nickname}${finalClient.config.domain}`);
                    }
                });
            }
        });
        
        setEmailData({
            from: initialClients[0] || '',
            to: finalClients[0] || '',
            subject: 'Prueba de SMTP',
            message: 'Este es un mensaje de prueba para el simulador SMTP.'
        });
    };

    const handleSendEmail = () => {
        setLogs([]);
        addLog('Iniciando validación de la simulación...', 'info');
        if (!validateAllFieldsComplete()) {
            addLog('Validación de campos incompleta. Simulación abortada.', 'error');
            return;
        }

        const { isValid, message } = validateSimulationStructure();
        if (!isValid) {
            showNotification(`Error de estructura de red: ${message}`);
            addLog(`Error de estructura de red: ${message}`, 'error');
            return;
        }
        addLog('Validación de estructura de red completada con éxito.', 'success');

        assignDomainsToClients();

        addLog(`Correo configurado: De: ${emailData.from}, Para: ${emailData.to}, Asunto: ${emailData.subject}`, 'success');
        setShowEmailConfig(false);
        setSimulationStatus('running');
        addLog('✔️Simulación iniciada.', 'success');
        runSmtpProtocolSimulation();
    };
    
    const handleCancelEmail = () => {
        setShowEmailConfig(false);
        setEmailData({
            from: '',
            to: '',
            subject: '',
            message: ''
        });
        addLog('🚫Configuración de correo electrónico cancelada.', 'warning');
    };

    const stopSimulation = () => {
        simulationAbortRef.current = true;
        setSimulationStatus('disconnected');
        setIsConnecting(false);
        setConnectionStart(null);
        addLog('⏹️Simulación detenida.', 'warning');
    };

    const resetSimulation = () => {
        simulationAbortRef.current = true;
        setElements([]);
        setConnections([]);
        setSimulationStatus('disconnected');
        setSelectedTool(null);
        setDraggedElement(null);
        setIsConnecting(false);
        setConnectionStart(null);
        setConfigModal(null);
        setShowEmailConfig(false);
        setEmailData({ from: '', to: '', subject: '', message: '' });
        setLogs([]);
        addLog('🔄Simulación y elementos reiniciados.', 'warning');
    };

    const loadExample = () => {
        resetSimulation();
        const exampleElements = [
            { id: 'c1', type: 'client', name: 'Cliente 1', x: 80, y: 150, config: { nickname: 'juan', domain: '@correo.com', port: 587 } },
            { id: 'c2', type: 'client', name: 'Cliente 2', x: 80, y: 300, config: { nickname: 'maria', domain: '@correo.com', port: 587 } },
            { id: 's1', type: 'server', name: 'Servidor A', x: 350, y: 220, config: { domain: 'correo.com', port: 25, maxConnections: 100 } },
            { id: 's2', type: 'server', name: 'Servidor B', x: 620, y: 120, config: { domain: 'destino.com', port: 25, maxConnections: 100 } },
            { id: 's3', type: 'server', name: 'Servidor C', x: 620, y: 330, config: { domain: 'empresa.com', port: 25, maxConnections: 100 } },
            { id: 'c3', type: 'client', name: 'Cliente 3', x: 880, y: 100, config: { nickname: 'pedro', domain: '@destino.com', port: 587 } },
            { id: 'c4', type: 'client', name: 'Cliente 4', x: 880, y: 350, config: { nickname: 'laura', domain: '@empresa.com', port: 587 } },
        ];
        const exampleConnections = [
            { id: 'conn1', from: 'c1', to: 's1', fromPos: { x: 180, y: 175 }, toPos: { x: 350, y: 245 } },
            { id: 'conn2', from: 'c2', to: 's1', fromPos: { x: 180, y: 325 }, toPos: { x: 350, y: 245 } },
            { id: 'conn3', from: 's1', to: 's2', fromPos: { x: 450, y: 245 }, toPos: { x: 620, y: 145 } },
            { id: 'conn4', from: 's1', to: 's3', fromPos: { x: 450, y: 245 }, toPos: { x: 620, y: 355 } },
            { id: 'conn5', from: 's2', to: 'c3', fromPos: { x: 720, y: 145 }, toPos: { x: 880, y: 125 } },
            { id: 'conn6', from: 's3', to: 'c4', fromPos: { x: 720, y: 355 }, toPos: { x: 880, y: 375 } },
        ];
        setElements(exampleElements);
        setConnections(exampleConnections);
        addLog('Ejemplo de topología SMTP cargado: 2 clientes → Servidor A → Servidores B y C → clientes finales.', 'success');
    };

    const delay = (ms) => new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            if (simulationAbortRef.current) reject(new Error('aborted'));
            else resolve();
        }, ms);
        if (simulationAbortRef.current) {
            clearTimeout(id);
            reject(new Error('aborted'));
        }
    });

    const runSmtpProtocolSimulation = async () => {
        simulationAbortRef.current = false;
        try {
        addLog('🚀Iniciando protocolo SMTP...', 'success');

        const fromClientName = emailData.from.split('@')[0];
        const fromClient = elements.find(el => el.type === 'client' && el.config.nickname === fromClientName);
        const initialServerConnection = connections.find(conn => conn.from === fromClient?.id);
        const firstServer = initialServerConnection ? elements.find(el => el.id === initialServerConnection.to && el.type === 'server') : null;

        if (!fromClient || !firstServer) {
            addLog('Error: No se pudo identificar el cliente remitente o el primer servidor para la simulación.', 'error');
            setSimulationStatus('disconnected');
            return;
        }

        addLog(`[${fromClient.name}] Estableciendo conexión con [${firstServer.name}:${firstServer.config.port}]...`, 'client');
        await delay(1000);

        addLog(`[${firstServer.name}] 220 ${firstServer.config.domain} ESMTP Listo`, 'server');
        await delay(300);
        addLog(`[${fromClient.name}] HELO ${fromClient.config.domain.replace('@', '')}`, 'client');
        await delay(700);

        addLog(`[${firstServer.name}] 250 ${firstServer.config.domain} ¡Hola!`, 'server');
        await delay(300);
        addLog(`[${fromClient.name}] MAIL FROM:<${emailData.from}>`, 'client');
        await delay(700);

        addLog(`[${firstServer.name}] 250 OK`, 'server');
        await delay(300);
        addLog(`[${fromClient.name}] RCPT TO:<${emailData.to}>`, 'client');
        await delay(700);

        const toDomain = emailData.to.split('@')[1];
        const intermediateServers = elements.filter(el => el.type === 'server' && el.id !== firstServer.id);

        let needsRelay = true;
        for (const intServer of intermediateServers) {
            const outgoingConns = connections.filter(conn => conn.from === intServer.id);
            const clientsConnected = outgoingConns.map(conn => elements.find(el => el.id === conn.to && el.type === 'client'));
            if (clientsConnected.some(client => client && client.config.domain === `@${toDomain}`)) {
                needsRelay = false;
                break;
            }
        }

        await delay(700);

        if (!needsRelay) {
            addLog(`[${firstServer.name}] 250 OK`, 'server');
            await delay(300);
            addLog(`[${fromClient.name}] DATA`, 'client');
            await delay(800);

            addLog(`[${firstServer.name}] 354 Ingrese el correo, termine con <CRLF>.<CRLF>`, 'server');
            await delay(300);
            addLog(`[${fromClient.name}] Subject: ${emailData.subject}`, 'client');
            await delay(300);
            addLog(`[${fromClient.name}] ${emailData.message}`, 'client');
            await delay(300);
            addLog(`[${fromClient.name}] .`, 'client');
            await delay(800);

            addLog(`[${firstServer.name}] 250 OK: mensaje en cola`, 'server');
            await delay(300);
            addLog(`[${fromClient.name}] QUIT`, 'client');
            await delay(700);

            addLog(`[${firstServer.name}] 221 ${firstServer.config.domain} Service closing transmission channel`, 'server');
            await delay(300);
            addLog('✅Correo enviado exitosamente.', 'success');
            setSimulationStatus('disconnected');

        } else {
            addLog(`[${firstServer.name}] 250 OK, retransmisión para <${emailData.to}>`, 'server');
            await delay(300);
            addLog(`[${fromClient.name}] DATA`, 'client');
            await delay(800);

            addLog(`[${firstServer.name}] 354 Ingrese el correo, termine con <CRLF>.<CRLF>`, 'server');
            await delay(300);
            addLog(`[${fromClient.name}] Subject: ${emailData.subject}`, 'client');
            await delay(300);
            addLog(`[${fromClient.name}] ${emailData.message}`, 'client');
            await delay(300);
            addLog(`[${fromClient.name}] .`, 'client');
            await delay(800);

            const nextServerConnection = connections.find(conn => conn.from === firstServer.id && elements.find(el => el.id === conn.to)?.type === 'server');
            const nextServer = nextServerConnection ? elements.find(el => el.id === nextServerConnection.to) : null;

            if (nextServer) {
                addLog(`[${firstServer.name}] 250 OK: mensaje en cola para retransmisión`, 'server');
                await delay(300);
                addLog(`[${firstServer.name}] Retransmitiendo a [${nextServer.name}:${nextServer.config.port}]...`, 'client');
                await delay(800);

                addLog(`[${nextServer.name}] 220 ${nextServer.config.domain} ESMTP Listo`, 'server');
                await delay(300);
                addLog(`[${firstServer.name}] HELO ${firstServer.config.domain}`, 'client');
                await delay(700);

                addLog(`[${nextServer.name}] 250 ${nextServer.config.domain} ¡Hola!`, 'server');
                await delay(300);
                addLog(`[${firstServer.name}] MAIL FROM:<${emailData.from}>`, 'client');
                await delay(700);

                addLog(`[${nextServer.name}] 250 OK`, 'server');
                await delay(300);
                addLog(`[${firstServer.name}] RCPT TO:<${emailData.to}>`, 'client');
                await delay(700);

                addLog(`[${nextServer.name}] 250 OK`, 'server');
                await delay(300);
                addLog(`[${firstServer.name}] DATA`, 'client');
                await delay(800);

                addLog(`[${nextServer.name}] 354 Ingrese el correo, termine con <CRLF>.<CRLF>`, 'server');
                await delay(300);
                addLog(`[${firstServer.name}] Subject: ${emailData.subject}`, 'client');
                await delay(300);
                addLog(`[${firstServer.name}] ${emailData.message}`, 'client');
                await delay(300);
                addLog(`[${firstServer.name}] .`, 'client');
                await delay(800);

                addLog(`[${nextServer.name}] 250 OK: mensaje en cola`, 'server');
                await delay(300);
                addLog(`[${firstServer.name}] QUIT`, 'client');
                await delay(700);

                addLog(`[${nextServer.name}] 221 ${nextServer.config.domain} Service closing transmission channel`, 'server');
                await delay(300);
                addLog(`[${firstServer.name}] QUIT`, 'client');
                await delay(300);
                addLog(`[${firstServer.name}] 221 ${firstServer.config.domain} Service closing transmission channel`, 'server');
                await delay(300);
                addLog('Correo retransmitido exitosamente al servidor intermedio.', 'success');
                setSimulationStatus('disconnected');
            } else {
                addLog('No se encontró un servidor intermedio para la retransmisión.', 'error');
                setSimulationStatus('disconnected');
            }
        }
        } catch (e) {
            if (e.message !== 'aborted') {
                addLog('Error inesperado en la simulación.', 'error');
            }
        }
    };

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addLog = (message, type = 'info') => {
        setLogs(prevLogs => [...prevLogs, { timestamp: new Date().toLocaleTimeString(), message, type }]);
    };

    const showNotification = (message, type = 'error') => {
        setNotification({ message, type });
    };

    const handleToolDragStart = (e, tool) => {
        setSelectedTool(tool);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleCanvasDrop = (e) => {
        e.preventDefault();
        if (!selectedTool) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newElement = {
            id: generateId(),
            type: selectedTool.id,
            name: `${selectedTool.name} ${elements.filter(el => el.type === selectedTool.id).length + 1}`,
            x: x - 50, // Centrar el elemento
            y: y - 25,
            config: selectedTool.id === 'client' ? {
                nickname: '',
                domain: '',
                port: 587
            } : {
                domain: '',
                port: 25,
                maxConnections: 100
            }
        };

        setElements(prev => [...prev, newElement]);
        setSelectedTool(null);
    };

    const handleElementDragStart = (e, element) => {
        setDraggedElement(element);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleElementDrag = (e, elementId) => {
        if (!draggedElement || draggedElement.id !== elementId) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - 50;
        const y = e.clientY - rect.top - 25;

        setElements(prev => prev.map(el =>
            el.id === elementId ? { ...el, x, y } : el
        ));
    };

    const handleElementClick = (element, e) => {
        e.stopPropagation();

        if (isConnecting) {
            if (!connectionStart) {
                setConnectionStart(element);
            } else if (connectionStart.id !== element.id) {
                if (connectionStart.type === 'client' && element.type === 'client') {
                    showNotification('No se puede conectar un cliente a otro cliente.');
                    setConnectionStart(null);
                    setIsConnecting(false);
                    return;
                }

                const newConnection = {
                    id: generateId(),
                    from: connectionStart.id,
                    to: element.id,
                    fromPos: { x: connectionStart.x + 50, y: connectionStart.y + 25 },
                    toPos: { x: element.x + 50, y: element.y + 25 }
                };
                setConnections(prev => [...prev, newConnection]);
                setConnectionStart(null);
                setIsConnecting(false);
            }
        }
    };

    const openConfigModal = (element, e) => {
        e.stopPropagation();
        setConfigModal(element);
    };

    const validateAllFieldsComplete = () => {
        for (const element of elements) {
            if (element.type === 'client') {
                if (!element.name.trim() || !element.config.nickname?.trim()) {
                    showNotification(`El cliente "${element.name}" debe tener nombre y nickname completos.`);
                    return false;
                }
            } else if (element.type === 'server') {
                if (!element.name.trim() || !element.config.domain?.trim() || !element.config.port || !element.config.maxConnections) {
                    showNotification(`El servidor "${element.name}" debe tener nombre, dominio, puerto y máximo de conexiones completos.`);
                    return false;
                }
            }
        }
        return true;
    };

    const assignDomainsToClients = () => {
        const elementMap = new Map(elements.map(el => [el.id, el]));
        const firstServer = elements.find(server => {
            if (server.type !== 'server') return false;
            
            const incomingConns = connections.filter(conn => conn.to === server.id);
            const outgoingConns = connections.filter(conn => conn.from === server.id);
            
            const incomingFromClients = incomingConns.filter(conn => elementMap.get(conn.from)?.type === 'client');
            const incomingFromServers = incomingConns.filter(conn => elementMap.get(conn.from)?.type === 'server');
            const outgoingToServers = outgoingConns.filter(conn => elementMap.get(conn.to)?.type === 'server');
            const outgoingToClients = outgoingConns.filter(conn => elementMap.get(conn.to)?.type === 'client');
            
            return incomingFromClients.length > 0 && incomingFromServers.length === 0 && 
                   outgoingToServers.length > 0 && outgoingToClients.length === 0;
        });
        
        if (firstServer) {
            const initialClientsConnections = connections.filter(conn => 
                conn.to === firstServer.id && elementMap.get(conn.from)?.type === 'client'
            );
            
            for (const conn of initialClientsConnections) {
                const client = elementMap.get(conn.from);
                if (client) {
                    setElements(prev => prev.map(el =>
                        el.id === client.id 
                            ? { ...el, config: { ...el.config, domain: `@${firstServer.config.domain}` } }
                            : el
                    ));
                }
            }
            
            const intermediateServersConnections = connections.filter(conn => conn.from === firstServer.id);
            
            for (const conn of intermediateServersConnections) {
                const intermediateServer = elementMap.get(conn.to);
                if (intermediateServer && intermediateServer.type === 'server') {
                    const finalClientsConnections = connections.filter(finalConn => 
                        finalConn.from === intermediateServer.id && elementMap.get(finalConn.to)?.type === 'client'
                    );
                    
                    for (const finalConn of finalClientsConnections) {
                        const finalClient = elementMap.get(finalConn.to);
                        if (finalClient) {
                            setElements(prev => prev.map(el =>
                                el.id === finalClient.id 
                                    ? { ...el, config: { ...el.config, domain: `@${intermediateServer.config.domain}` } }
                                    : el
                            ));
                        }
                    }
                }
            }
        }
    };

    const getLineRectIntersection = (lineP1, lineP2, rect) => {
        const { x, y, width, height } = rect;
        const line = { p1: lineP1, p2: lineP2 };

        const rectLines = [
            { p1: { x: x, y: y }, p2: { x: x + width, y: y } },
            { p1: { x: x + width, y: y }, p2: { x: x + width, y: y + height } },
            { p1: { x: x + width, y: y + height }, p2: { x: x, y: y + height } },
            { p1: { x: x, y: y + height }, p2: { x: x, y: y } }
        ];

        let closestIntersection = null;
        let minDistanceSq = Infinity;

        const intersectSegments = (l1p1, l1p2, l2p1, l2p2) => {
            const s1_x = l1p2.x - l1p1.x;
            const s1_y = l1p2.y - l1p1.y;
            const s2_x = l2p2.x - l2p1.x;
            const s2_y = l2p2.y - l2p1.y;

            const denom = (-s2_x * s1_y) + (s1_x * s2_y);
            if (denom === 0) return null;

            const s = (-s1_y * (l1p1.x - l2p1.x) + s1_x * (l1p1.y - l2p1.y)) / denom;
            const t = (s2_x * (l1p1.y - l2p1.y) - s2_y * (l1p1.x - l2p1.x)) / denom;

            if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                return {
                    x: l1p1.x + (t * s1_x),
                    y: l1p1.y + (t * s1_y)
                };
            }
            return null;
        };

        for (const rectLine of rectLines) {
            const intersection = intersectSegments(line.p1, line.p2, rectLine.p1, rectLine.p2);
            if (intersection) {
                const distSq = (intersection.x - lineP1.x)**2 + (intersection.y - lineP1.y)**2;
                if (distSq < minDistanceSq) {
                    minDistanceSq = distSq;
                    closestIntersection = intersection;
                }
            }
        }
        return closestIntersection;
    };

    const saveConfig = (config) => {
        setElements(prev => prev.map(el =>
            el.id === configModal.id ? { 
                ...el, 
                name: config.name,
                config: { ...el.config, ...config.config }
            } : el
        ));
        setConfigModal(null);
    };

    const deleteElement = (elementId) => {
        setElements(prev => prev.filter(el => el.id !== elementId));
        setConnections(prev => prev.filter(conn =>
            conn.from !== elementId && conn.to !== elementId
        ));
    };

    const updateConnectionPositions = () => {
        setConnections(prev => prev.map(conn => {
            const fromElement = elements.find(el => el.id === conn.from);
            const toElement = elements.find(el => el.id === conn.to);

            if (fromElement && toElement) {
                return {
                    ...conn,
                    fromPos: { x: fromElement.x + 50, y: fromElement.y + 25 },
                    toPos: { x: toElement.x + 50, y: toElement.y + 25 }
                };
            }
            return conn;
        }));
    };

    React.useEffect(() => {
        updateConnectionPositions();
    }, [elements]);

    React.useEffect(() => {
        const elementMap = new Map(elements.map(el => [el.id, el]));
        let elementsToUpdate = [];
        
        for (const conn of connections) {
            const fromElement = elementMap.get(conn.from);
            const toElement = elementMap.get(conn.to);
            
            if (fromElement?.type === 'client' && toElement?.type === 'server' && toElement.config.domain) {
                const expectedDomain = `@${toElement.config.domain}`;
                if (fromElement.config.domain !== expectedDomain) {
                    elementsToUpdate.push({
                        id: fromElement.id,
                        domain: expectedDomain
                    });
                }
            }
            
            if (fromElement?.type === 'server' && toElement?.type === 'client' && fromElement.config.domain) {
                const expectedDomain = `@${fromElement.config.domain}`;
                if (toElement.config.domain !== expectedDomain) {
                    elementsToUpdate.push({
                        id: toElement.id,
                        domain: expectedDomain
                    });
                }
            }
        }
        
        if (elementsToUpdate.length > 0) {
            setElements(prev => prev.map(el => {
                const update = elementsToUpdate.find(u => u.id === el.id);
                return update 
                    ? { ...el, config: { ...el.config, domain: update.domain } }
                    : el;
            }));
        }
    }, [elements, connections]);

    return (
        <div className="flex h-screen bg-gray-100">
            {notification && (
                <AlertNotification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="w-64 bg-gray-800 shadow-lg p-4 flex flex-col">
                <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-2">
                    <Wrench size={20} />
                    Herramientas
                </h3>

                <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-blue-300 mb-1">
                        <MousePointer size={14} />
                        <span className="text-xs font-semibold">Arrastrar y soltar</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                        Arrastra los componentes desde aquí hasta el lienzo para construir tu topología de red.
                    </p>
                </div>

                <div className="space-y-2 mb-4">
                    {tools.map(tool => {
                        const Icon = tool.icon;
                        return (
                            <div
                                key={tool.id}
                                draggable
                                onDragStart={(e) => handleToolDragStart(e, tool)}
                                className={`${tool.color} text-white p-3 rounded-lg cursor-grab hover:opacity-80 flex items-center space-x-2 active:cursor-grabbing`}
                            >
                                <GripVertical size={14} className="opacity-60" />
                                <Icon size={18} />
                                <span className="text-sm">{tool.name}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-2 mb-4">
                    <button
                        onClick={() => setIsConnecting(!isConnecting)}
                        className={`w-full p-2 rounded flex items-center justify-center space-x-2 ${isConnecting ? 'bg-orange-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'
                            }`}
                    >
                        <Cable size={16} />
                        <span className="text-sm">
                            {isConnecting ? 'Cancelar conexión' : 'Conectar elementos'}
                        </span>
                    </button>

                    {isConnecting && connectionStart && (
                        <div className="text-xs text-yellow-200 p-2 bg-yellow-900/40 rounded">
                            Selecciona el elemento destino para crear la conexión
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t">
                    <button
                        onClick={loadExample}
                        className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 text-sm font-medium"
                    >
                        <Zap size={16} />
                        <span>Ejemplo de simulación</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 relative">

            <div className="absolute top-4 right-4 bg-white p-2 px-3 rounded-lg shadow-md flex items-center gap-2 flex-wrap z-10">
                <div className="flex items-center space-x-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full 
                        ${simulationStatus === 'running' ? 'bg-green-500' :
                        simulationStatus === 'paused' ? 'bg-yellow-500' :
                        'bg-red-500'}`}></div>
                    <span className="text-gray-700 text-xs font-semibold">
                        Estado:
                    </span>
                    <span className={`font-bold text-xs
                        ${simulationStatus === 'running' ? 'text-green-600' :
                        simulationStatus === 'paused' ? 'text-yellow-600' :
                        'text-red-600'}`}>
                        {simulationStatus === 'disconnected' ? 'Desconectado' :
                        simulationStatus === 'paused' ? 'Pausado' :
                        'Conectado'}
                    </span>
                </div>

                    <button
                        onClick={startSimulation}
                        className="flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition duration-200 shrink-0"
                    >
                        {simulationStatus === 'running' ? (
                            <Pause size={14} className="mr-1" /> 
                        ) : (
                            <Play size={14} className="mr-1" /> 
                        )}
                        {simulationStatus === 'running' ? 'Pausar' : 'Iniciar'}
                    </button>
                    <button
                        onClick={stopSimulation} 
                        className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 shrink-0"
                        title="Detener Simulación"
                    >
                        <Square size={14} />
                    </button>
                    <button
                        onClick={resetSimulation}
                        className="p-1.5 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200 shrink-0"
                        title="Resetear Simulación"
                    >
                        <RefreshCcw size={14} />
                    </button>
                </div>
                <div
                    ref={canvasRef}
                    className="w-full h-full bg-gray-50 relative overflow-hidden"
                    onDrop={handleCanvasDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => {
                        setIsConnecting(false);
                        setConnectionStart(null);
                    }}
                >
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <defs>
                            <marker
                                id="arrowhead"
                                viewBox="0 0 10 10"
                                refX="9" refY="5"
                                markerUnits="strokeWidth"
                                markerWidth="8" markerHeight="6"
                                orient="auto-start-reverse"
                            >
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5563" />
                            </marker>
                        </defs>

                        {connections.map(conn => {
                            const fromElement = elements.find(el => el.id === conn.from);
                            const toElement = elements.find(el => el.id === conn.to);

                            if (!fromElement || !toElement) return null;

                            const fromCenter = { x: fromElement.x + 50, y: fromElement.y + 25 };
                            const toCenter = { x: toElement.x + 50, y: toElement.y + 25 };

                            const toRect = {
                                x: toElement.x,
                                y: toElement.y,
                                width: 100,
                                height: 50
                            };

                            const fromRect = {
                                x: fromElement.x,
                                y: fromElement.y,
                                width: 100,
                                height: 50
                            };

                            const endPointOnToElement = getLineRectIntersection(fromCenter, toCenter, toRect);
                            const actualEndX = endPointOnToElement ? endPointOnToElement.x : toCenter.x;
                            const actualEndY = endPointOnToElement ? endPointOnToElement.y : toCenter.y;
                            const startPointOnFromElement = getLineRectIntersection(toCenter, fromCenter, fromRect);
                            const actualStartX = startPointOnFromElement ? startPointOnFromElement.x : fromCenter.x;
                            const actualStartY = startPointOnFromElement ? startPointOnFromElement.y : fromCenter.y;
                            const dPath = `M ${actualStartX},${actualStartY} L ${actualEndX},${actualEndY}`;

                            return (
                                <path
                                    key={conn.id}
                                    d={dPath}
                                    stroke="#4b5563"
                                    strokeWidth="2"
                                    fill="none"
                                    markerEnd="url(#arrowhead)"
                                    strokeDasharray="5 5"
                                />
                            );
                        })}
                    </svg>

                    {elements.map(element => {
                        const tool = tools.find(t => t.id === element.type);
                        const Icon = tool.icon;

                        return (
                            <div
                                key={element.id}
                                draggable
                                onDragStart={(e) => handleElementDragStart(e, element)}
                                onDrag={(e) => handleElementDrag(e, element.id)}
                                onClick={(e) => handleElementClick(element, e)}
                                className={`absolute w-24 h-12 ${tool.color} text-white rounded-lg cursor-move hover:opacity-80 flex items-center justify-center shadow-lg group`}
                                style={{ left: element.x, top: element.y }}
                            >
                                <Icon size={20} />

                                <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <button
                                        onClick={(e) => openConfigModal(element, e)}
                                        className="bg-indigo-600 text-white p-1 rounded text-xs hover:bg-indigo-700"
                                    >
                                        <Settings size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteElement(element.id);
                                        }}
                                        className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>

                                <div className="absolute -bottom-6 left-0 text-xs text-gray-700 whitespace-nowrap">
                                    {element.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md z-10 w-[30rem] max-h-[26rem] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
                    <h2 className="text-sm font-semibold text-gray-100 flex items-center">
                        <Terminal className="mr-2 text-blue-400" size={16} />
                        Log de Comunicación
                    </h2>
                    <button
                        className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition"
                        onClick={handleNavigateHome}
                    >
                        Volver al Menú
                    </button>
                </div>
                <CommunicationLog logs={logs} hideHeader />
            </div>

            {configModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">
                            Configurar {configModal.name}
                        </h3>

                        <ConfigForm
                            element={configModal}
                            onSave={saveConfig}
                            onCancel={() => setConfigModal(null)}
                        />
                    </div>
                </div>
            )}
            
            {showEmailConfig && (
                <EmailConfigScreen
                    emailData={emailData}
                    setEmailData={setEmailData}
                    onSend={handleSendEmail}
                    onCancel={handleCancelEmail}
                    initialClients={getInitialClients()}
                    finalClients={getFinalClients()}
                />
            )}
            {loading && <LoadingScreen text="Volviendo al Menú..." onComplete={handleLoadComplete} />}
        </div>
    );
};

const ConfigForm = ({ element, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: element.name || '',
        nickname: element.config?.nickname || '',
        domain: element.config?.domain || (element.type === 'client' ? '@' : ''),
        port: element.config?.port || (element.type === 'client' ? 587 : 25),
        maxConnections: element.config?.maxConnections || 100
    });

    const handleSubmit = () => {
        const { name, ...configFields } = formData;
        onSave({
            name: name,
            config: configFields
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                </div>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {element.type === 'client' ? (
    <>
        <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
                Nickname (parte inicial del correo)
            </div>
            <input
                type="text"
                value={formData.nickname || ''}
                onChange={(e) => handleChange('nickname', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="usuario"
            />
        </div>
        <div>
    <div className="block text-sm font-medium text-gray-700 mb-1">
        Dominio (asignado automáticamente)
    </div>
        <input
            type="text"
            value={formData.domain}
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            disabled
            placeholder="Se asigna automáticamente según el servidor"
        />
        <div className="text-xs text-gray-500 mt-1">
            El dominio se asigna automáticamente según el servidor al que esté conectado
        </div>
    </div>
        <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
                Puerto
            </div>
            <input
                type="number"
                value={formData.port || 587}
                onChange={(e) => handleChange('port', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-600">
            <strong>Correo completo:</strong> {(formData.nickname || 'usuario') + (formData.domain || '@')}
        </div>
    </>
) : (
    <>
        <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
                Dominio del Servidor
            </div>
            <input
                type="text"
                value={formData.domain || ''}
                onChange={(e) => handleChange('domain', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="mi-servidor.com"
            />
        </div>
        <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
                Puerto
            </div>
            <input
                type="number"
                value={formData.port || 25}
                onChange={(e) => handleChange('port', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de conexiones
            </div>
            <input
                type="number"
                value={formData.maxConnections || 100}
                onChange={(e) => handleChange('maxConnections', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
        </div>
    </>
)}

            <div className="flex space-x-3 pt-4">
                <button
                    onClick={handleSubmit}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                >
                    Guardar
                </button>
                <button
                    onClick={onCancel}
                    className="flex-1 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
                >
                    Cancelar
                </button>
                
                            </div>
        </div>
    );
};

export default DynamicSimulator;