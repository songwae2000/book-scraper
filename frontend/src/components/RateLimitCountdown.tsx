import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface RateLimitCountdownProps {
    rateLimitInfo: {
        remaining: number;
        resetTime: number;
        isLimited: boolean;
    } | null;
}

const RateLimitCountdown: React.FC<RateLimitCountdownProps> = ({ rateLimitInfo }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        if (!rateLimitInfo?.isLimited) {
            setTimeLeft(0);
            return;
        }

        const calculateTimeLeft = () => {
            const now = Date.now();
            const timeRemaining = Math.max(0, rateLimitInfo.resetTime - now);
            setTimeLeft(Math.ceil(timeRemaining / 1000));
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [rateLimitInfo]);

    if (!rateLimitInfo) return null;

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (rateLimitInfo.isLimited && timeLeft > 0) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Rate limit exceeded</span>
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Try again in {formatTime(timeLeft)}</span>
                </div>
            </div>
        );
    }

    if (rateLimitInfo.remaining !== null && rateLimitInfo.remaining < 5) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{rateLimitInfo.remaining} requests remaining</span>
            </div>
        );
    }

    return null;
};

export default RateLimitCountdown;
