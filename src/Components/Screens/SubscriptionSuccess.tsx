import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SubscriptionSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [seconds, setSeconds] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            navigate('/');
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Subscription Active!
                </h1>

                <p className="text-gray-600 mb-6">
                    Thank you for subscribing. Your account has been upgraded successfully.
                </p>

                {sessionId && (
                    <p className="text-xs text-gray-400 mb-6 font-mono">
                        ID: {sessionId.slice(0, 10)}...
                    </p>
                )}

                <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
                    <div
                        className="bg-green-600 h-full transition-all duration-1000 ease-linear"
                        style={{ width: `${((3 - seconds) / 3) * 100}%` }}
                    />
                </div>

                <p className="text-sm text-gray-500">
                    Redirecting to dashboard in {seconds}s...
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="mt-6 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                    Go to Dashboard Now
                </button>
            </div>
        </div>
    );
};

export default SubscriptionSuccess;
