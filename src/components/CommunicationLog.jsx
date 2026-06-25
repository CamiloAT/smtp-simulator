import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

const CommunicationLog = ({ logs }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);
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
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden">
            <h2 className="text-sm font-semibold px-4 pt-3 pb-2 text-gray-800 flex items-center shrink-0">
                <Terminal className="mr-2 text-blue-600" size={16} />
                Log de Comunicación
            </h2>
            <div className="bg-gray-900 rounded-lg mx-3 mb-3 flex-1 min-h-0">
                <div ref={scrollRef} className="h-full overflow-y-auto space-y-1.5 p-3 flex flex-col scrollbar-thin scrollbar-thumb-gray-600">
                    {logs.length === 0 ? (
                        <div className="text-gray-400 text-center flex flex-col items-center justify-center h-full">
                            <Terminal size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Esperando simulación...</p>
                        </div>
                    ) : (
                        logs.map((log, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded border-l-4 ${getLogColor(log.type)} transition-all duration-200`}
                            >
                                <div className="flex items-start space-x-1.5">
                                    <span className="font-mono text-xs mt-0.5 opacity-70">
                                        {getLogIcon(log.type)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-mono text-xs whitespace-pre-wrap break-words">{log.message}</div>
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
