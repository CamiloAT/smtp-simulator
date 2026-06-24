import React from 'react';
import { Server, Play, RotateCcw } from 'lucide-react';

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

export default SimulationControls;
