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
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center space-x-3">
                    <Server className={`${getStatusColor(connectionStatus)}`} size={18} />
                    <span className="text-xs font-medium">
                        Estado: <span className={`${getStatusColor(connectionStatus)} font-semibold`}>
                            {getStatusText(connectionStatus)}
                        </span>
                    </span>
                </div>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={onStart}
                    disabled={isRunning}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-sm font-medium"
                >
                    <Play className="mr-2" size={16} />
                    {isRunning ? 'Simulando...' : 'Iniciar'}
                </button>
                <button
                    onClick={onReset}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                    title="Resetear"
                >
                    <RotateCcw size={16} />
                </button>
            </div>
        </div>
    );
};

export default SimulationControls;
