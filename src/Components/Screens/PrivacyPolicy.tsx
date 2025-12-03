import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Effective Date: December 3, 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                We collect information to provide and improve your learning experience on EdHub360. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li>
                  <strong>Account Information:</strong> Name, email address, and credentials when you register or log in.
                </li>
                <li>
                  <strong>Learning Activity:</strong> Quiz scores, flashcard progress, course completion status, and time spent on materials.
                </li>
                <li>
                  <strong>Device & Usage Data:</strong> Browser type, IP address, device type, and pages visited to understand how you use the platform.
                </li>
                <li>
                  <strong>Cookies & Tracking:</strong> We use cookies to maintain your session and remember your preferences.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. How We Use Your Data
              </h2>
              <p className="text-gray-700 mb-4">
                Your information helps us deliver and enhance EdHub360:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li>
                  <strong>Provide Services:</strong> Enable you to access courses, quizzes, flashcards, and notes.
                </li>
                <li>
                  <strong>Personalize Learning:</strong> Recommend content, track progress, and adapt difficulty levels to your needs.
                </li>
                <li>
                  <strong>Service Improvement:</strong> Analyze usage patterns to fix bugs, improve features, and develop new tools.
                </li>
                <li>
                  <strong>Legal Compliance:</strong> Comply with laws and respond to legal requests when required.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Your Privacy Rights
              </h2>
              <p className="text-gray-700 mb-4">
                You have the right to control your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li>
                  <strong>Access & Correction:</strong> Request a copy of your data or ask us to correct inaccuracies.
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account and associated data (subject to legal obligations).
                </li>
                <li>
                  <strong>Opt-Out:</strong> Disable non-essential cookies and unsubscribe from marketing communications at any time.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Security & Contact
              </h2>
              <p className="text-gray-700 mb-4">
                We implement reasonable security measures to protect your data, including encryption and access controls. However, no system is entirely secure, and we cannot guarantee absolute protection.
              </p>
              <p className="text-gray-700">
                If you have privacy questions or requests, contact us at:{' '}
                <a href="mailto:edhub360help@gmail.com" className="text-blue-600 hover:underline">
                  edhub360help@gmail.com
                </a>
              </p>
            </section>

            {/* Disclaimer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic">
                Note: This is a generic privacy policy placeholder for development and testing purposes. It is not a legally reviewed document and should be customized with your specific practices, jurisdiction, and legal requirements before use in production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
