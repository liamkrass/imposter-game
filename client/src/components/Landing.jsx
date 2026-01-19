import React, { useState } from 'react';
import LocalGame from './LocalGame';

function Landing() {
    const [mode, setMode] = useState('menu'); // menu, local

    if (mode === 'local') {
        return <LocalGame onExit={() => setMode('menu')} />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md mx-auto p-4 md:p-8 animate-fade-in relative z-10">
            {/* Logo / Header */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] mb-2">
                    Imposter
                </h1>
                <p className="text-blue-200/80 font-medium tracking-wide uppercase text-sm">Social Deduction Game</p>
            </div>

            <div className="glass-card rounded-3xl p-8 w-full flex flex-col gap-6">

                {mode === 'menu' && (
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setMode('local')}
                            className="group relative w-full py-5 text-white font-black text-2xl rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-xl shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all border border-white/10 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <span>PLAY</span>
                                <span className="text-sm font-normal opacity-80">(Local Party)</span>
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </div>
                )}
            </div>

            {/* Decoration Circles */}
            <div className="absolute top-0 left-0 -z-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 -z-10 w-64 h-64 bg-pink-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>
        </div>
    );
}

export default Landing;
