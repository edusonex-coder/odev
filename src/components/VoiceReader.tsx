import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceReaderProps {
    text: string;
    variant?: 'ghost' | 'outline' | 'secondary';
    size?: 'sm' | 'default' | 'icon';
    className?: string;
}

export const VoiceReader: React.FC<VoiceReaderProps> = ({ text, variant = 'ghost', size = 'sm', className }) => {
    const [speaking, setSpeaking] = useState(false);

    const speak = () => {
        if (!text) return;

        // Cancel existing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';

        // Find a better voice if possible
        const voices = window.speechSynthesis.getVoices();
        const trVoice = voices.find(v => v.lang.includes('tr-TR'));
        if (trVoice) utterance.voice = trVoice;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={speaking ? stop : speak}
            className={`gap-2 ${speaking ? 'text-primary animate-pulse' : 'text-muted-foreground'} ${className || ''}`}
            title={speaking ? "Durdur" : "Sesli Dinle"}
        >
            {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {size !== 'icon' && (speaking ? "Durdur" : "Sesli Dinle")}
        </Button>
    );
};
