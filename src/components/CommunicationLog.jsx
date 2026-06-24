import React from 'react';
import { Terminal } from 'lucide-react';

const CommunicationLog = ({ logs }) => {
    const getLogColor = (type) => {
        switch (type) {
            case 'client': return 'text-blue-700 bg-blue-50 border-l-blue-400';
            case 'server': return 'text-green-700 bg-green-50 border-l-green-400';
            case 'success': return 'text-green-800 bg-green-100 border-l-green-500';
            case 'error': return 'text-red-700 bg-red-50 border-l-red-400';
            case 'info': return 'text-gray-700 bg-gray-50 border-l-gray-400';
            case 'warning': return 'text-yellow-700 bg-yellow-50 border-l-yellow-400';
            default: return 'text-gray-700 bg-gray-50 border-l-gray-400';
        }
    };

    const getLogIcon = (type) => {
        switch (type) {
            case 'client': return '→';
            case 'server': return '←';
            case 'success': return '✓';
            case 'error': return '✗';
            case 'info': return '•';
            case 'warning': return '⚠';
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

export default CommunicationLog;
