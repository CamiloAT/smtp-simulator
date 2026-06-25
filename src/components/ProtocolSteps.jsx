import React, { useRef, useEffect } from 'react';
import { Info, CheckCircle, Clock } from 'lucide-react';

const ProtocolSteps = ({ steps, currentStep, isRunning }) => {
    const stepRefs = useRef([]);

    useEffect(() => {
        if (isRunning && stepRefs.current[currentStep]) {
            stepRefs.current[currentStep].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentStep, isRunning]);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-full flex flex-col">
            <h2 className="text-sm font-semibold mb-3 flex items-center text-gray-800 shrink-0">
                <Info className="mr-2 text-blue-600" size={16} />
                Pasos del Protocolo SMTP
            </h2>
            <div className="space-y-2 flex-1 overflow-y-auto">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        ref={el => stepRefs.current[index] = el}
                        className={`p-3 rounded-lg border-l-4 transition-all duration-300 ${index === currentStep && isRunning
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : index < currentStep
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-gray-800">{step.name}</span>
                            {index < currentStep && !isRunning && (
                                <CheckCircle className="text-green-500" size={14} />
                            )}
                            {index === currentStep && isRunning && (
                                <Clock className="text-blue-500 animate-spin" size={14} />
                            )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                        <div className="mt-1.5 flex flex-col gap-1">
                            <div className="text-xs text-blue-600 font-mono bg-blue-50 p-1.5 rounded truncate">
                                → {step.command.split('\n')[0]}
                            </div>
                            {step.expectedResponse && (
                                <div className="text-xs text-green-600 font-mono bg-green-50 p-1.5 rounded truncate">
                                    ← {step.expectedResponse.split('\n')[0]}
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
