import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

const LoadingScreen = ({ text, onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = Date.now();
        const duration = 2000;

        const animate = () => {
            const elapsed = Date.now() - start;
            const pct = Math.min(elapsed / duration, 1);
            setProgress(pct);
            if (pct < 1) {
                requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };
        requestAnimationFrame(animate);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
            <div className="relative z-10 flex flex-col items-center gap-6 animate-scale-in">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-indigo-600 rounded-2xl p-6 shadow-2xl shadow-indigo-500/30 animate-bounce-subtle">
                        <Mail size={48} className="text-white" strokeWidth={1.5} />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <h2 className="text-white text-xl font-bold">{text}</h2>
                    <div className="w-56 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-400 rounded-full"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
