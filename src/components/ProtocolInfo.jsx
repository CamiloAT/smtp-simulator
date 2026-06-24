import React from 'react';
import { BookOpen } from 'lucide-react';

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

export default ProtocolInfo;
