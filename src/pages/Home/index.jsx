import React from 'react';
import { Mail, MonitorSmartphone } from 'lucide-react';
import {
    EmailConfiguration,
    SimulationControls,
    ProtocolSteps,
    CommunicationLog,
    ProtocolInfo
} from '../../components';
import { useSmtpSimulation } from '../../hooks/useSmtpSimulation';

const Home = () => {
    const {
        isRunning,
        currentStep,
        logs,
        emailData,
        connectionStatus,
        smtpSteps,
        setEmailData,
        startSimulation,
        resetSimulation
    } = useSmtpSimulation();

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
                <div className="flex items-center space-x-3">
                    <Mail className="text-blue-600" size={28} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 leading-tight">Simulador SMTP</h1>
                        <p className="text-xs text-gray-500">Simple Mail Transfer Protocol</p>
                    </div>
                </div>
                <a
                    href="/simulator"
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                    <MonitorSmartphone size={16} />
                    <span>Simulador Dinámico</span>
                </a>
            </header>

            {/* Main content */}
            <main className="flex-1 grid grid-cols-12 grid-rows-1 gap-4 p-4 min-h-0">
                {/* Left column: Config + Controls */}
                <div className="col-span-3 flex flex-col gap-3 min-h-0 overflow-y-auto">
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
                </div>

                {/* Center: Protocol Steps */}
                <div className="col-span-5 min-h-0 overflow-y-auto">
                    <ProtocolSteps
                        steps={smtpSteps}
                        currentStep={currentStep}
                        isRunning={isRunning}
                    />
                </div>

                {/* Right: Communication Log + Info */}
                <div className="col-span-4 flex flex-col gap-2 min-h-0">
                    <CommunicationLog logs={logs} />
                    <ProtocolInfo />
                </div>
            </main>
        </div>
    );
};

export default Home;
