import React from 'react';
import { Settings } from 'lucide-react';

const EmailConfiguration = ({ emailData, setEmailData, isRunning }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-3 flex items-center text-gray-800">
                <Settings className="mr-2 text-blue-600" size={16} />
                Configuración del Email
            </h2>
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">De:</label>
                    <input
                        type="email"
                        value={emailData.from}
                        onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isRunning}
                        placeholder="usuario@cliente.com"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Para:</label>
                    <input
                        type="email"
                        value={emailData.to}
                        onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isRunning}
                        placeholder="destino@servidor.com"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Asunto:</label>
                    <input
                        type="text"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isRunning}
                        placeholder="Asunto del mensaje"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mensaje:</label>
                    <textarea
                        value={emailData.body}
                        onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-16 transition-all resize-none"
                        disabled={isRunning}
                        placeholder="Contenido del mensaje..."
                    />
                </div>
            </div>
        </div>
    );
};

export default EmailConfiguration;