import React from 'react';
import { Info, CheckCircle, Clock } from 'lucide-react';

const ProtocolSteps = ({ steps, currentStep, isRunning }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <Info className="mr-2 text-blue-600" size={20} />
                Pasos del Protocolo SMTP
            </h2>
            <div className="space-y-3">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${index === currentStep && isRunning
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : index < currentStep
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800">{step.name}</span>
                            {index < currentStep && !isRunning && (
                                <CheckCircle className="text-green-500" size={18} />
                            )}
                            {index === currentStep && isRunning && (
                                <Clock className="text-blue-500 animate-spin" size={18} />
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        <div className="mt-2 space-y-2">
                            <div className="text-xs text-blue-600 font-mono bg-blue-50 p-2 rounded">
                                <span className="text-gray-500">→ Cliente:</span> {step.command}
                            </div>
                            {step.expectedResponse && (
                                <div className="text-xs text-green-600 font-mono bg-green-50 p-2 rounded">
                                    <span className="text-gray-500">← Servidor:</span> {step.expectedResponse}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProtocolSteps;
