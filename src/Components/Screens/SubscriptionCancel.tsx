import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const SubscriptionCancel: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Checkout Cancelled
                </h1>

                <p className="text-gray-600 mb-8">
                    You have not been charged. If you encountered an issue, please try again or contact support.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
};

export default SubscriptionCancel;
