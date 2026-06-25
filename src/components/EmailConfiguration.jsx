import React from 'react';
import { Settings, Send, User, AtSign, FileText, MessageSquare } from 'lucide-react';

const EmailConfiguration = ({ emailData, setEmailData, isRunning }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-3 flex items-center text-gray-800">
                <Settings className="mr-2 text-indigo-600" size={16} />
                Configuración del Email
            </h2>
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
                        <User size={12} />
                        De:
                    </label>
                    <input
                        type="email"
                        value={emailData.from}
                        onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}
                        className="w-full px-3 py-2 text-sm font-semibold italic text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-gray-400 placeholder:not-italic placeholder:font-normal"
                        disabled={isRunning}
                        placeholder="usuario@cliente.com"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
                        <AtSign size={12} />
                        Para:
                    </label>
                    <input
                        type="email"
                        value={emailData.to}
                        onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                        className="w-full px-3 py-2 text-sm font-semibold italic text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-gray-400 placeholder:not-italic placeholder:font-normal"
                        disabled={isRunning}
                        placeholder="destino@servidor.com"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
                        <FileText size={12} />
                        Asunto:
                    </label>
                    <input
                        type="text"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        className="w-full px-3 py-2 text-sm font-bold text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-gray-400 placeholder:font-normal"
                        disabled={isRunning}
                        placeholder="Asunto del mensaje"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
                        <MessageSquare size={12} />
                        Mensaje:
                    </label>
                    <textarea
                        value={emailData.body}
                        onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                        className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 h-16 transition-all resize-none placeholder:text-gray-400 placeholder:font-normal"
                        disabled={isRunning}
                        placeholder="Contenido del mensaje..."
                    />
                </div>
            </div>
        </div>
    );
};

export default EmailConfiguration;