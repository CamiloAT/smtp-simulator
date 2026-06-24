import React, { useState } from 'react';
import { Mail } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        <Mail className="inline-block mr-4 text-blue-600" size={48} />
                        Simulador SMTP
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Simple Mail Transfer Protocol - Protocolo de Transferencia de Correo
                    </p>
                    <p className="text-sm text-gray-500">
                        Katlyn Galvis - Gabriel Cely - Diego Aguirre - Camilo Arias
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-1 space-y-6">
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
                        <ProtocolInfo />
                    </div>

                    <div className="xl:col-span-1">
                        <ProtocolSteps
                            steps={smtpSteps}
                            currentStep={currentStep}
                            isRunning={isRunning}
                        />
                    </div>

                    <div className="xl:col-span-1">
                        <CommunicationLog logs={logs} />
                    </div>
                </div>

                <div className="text-center mt-12 text-gray-500">
                    <p className="text-sm">
                        Simulador educativo del protocolo SMTP - Desarrollado para fines académicos
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
