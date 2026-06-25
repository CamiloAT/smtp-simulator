import { BookOpen } from 'lucide-react';

const ProtocolInfo = () => {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-3 shadow-sm shrink-0">
            <h3 className="text-xs font-semibold text-indigo-800 mb-2 flex items-center">
                <BookOpen className="mr-1.5" size={14} />
                Información Técnica SMTP
            </h3>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-indigo-700">
                <div>
                    <span className="font-semibold">Puertos:</span>
                    <p>25, 587, 465</p>
                </div>
                <div>
                    <span className="font-semibold">Protocolo:</span>
                    <p>TCP</p>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-semibold">Códigos:</span>
                    <span className="bg-green-100 px-1 rounded">2xx</span>
                    <span className="bg-yellow-100 px-1 rounded">3xx</span>
                    <span className="bg-orange-100 px-1 rounded">4xx</span>
                    <span className="bg-red-100 px-1 rounded">5xx</span>
                </div>
                <div className="col-span-3">
                    <span className="font-semibold">Comandos:</span>{' '}
                    HELO/EHLO, MAIL FROM, RCPT TO, DATA, QUIT
                </div>
            </div>
        </div>
    );
};

export default ProtocolInfo;
