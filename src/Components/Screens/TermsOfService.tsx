import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService: React.FC = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Effective Date: December 3, 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700">
                By accessing and using EdHub360, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use this service. We reserve the right to modify these terms at any time, and changes will be effective immediately upon posting.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Account Responsibility
              </h2>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality and security of your account:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li>Provide accurate and complete information during registration.</li>
                <li>Keep your password secure and do not share it with others.</li>
                <li>Notify us immediately of any unauthorized access or suspicious activity.</li>
                <li>You are solely responsible for all activities on your account.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Acceptable Use
              </h2>
              <p className="text-gray-700 mb-4">
                You agree to use EdHub360 only for lawful and educational purposes. You must not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li>Use the platform for illegal or harmful activities.</li>
                <li>Attempt to reverse-engineer, hack, or gain unauthorized access to the system.</li>
                <li>Upload malicious software, spam, or inappropriate content.</li>
                <li>Harass, abuse, or disrespect other users.</li>
                <li>Violate intellectual property rights or reproduce protected content.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Disclaimers & Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                EdHub360 is provided on an "as-is" basis without warranties of any kind. We do not guarantee that the platform will be error-free, uninterrupted, or secure. To the maximum extent permitted by law, EdHub360 and its operators shall not be liable for indirect, incidental, special, or consequential damages arising from your use of the service.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Governing Law
              </h2>
              <p className="text-gray-700">
                These Terms of Service are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflicts of law principles. Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Contact Us
              </h2>
              <p className="text-gray-700">
                If you have questions about these terms, contact us at:{' '}
                <a href="mailto:edhub360help@gmail.com" className="text-blue-600 hover:underline">
                  edhub360help@gmail.com
                </a>
              </p>
            </section>

            {/* Disclaimer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic">
                Note: This is a generic terms of service placeholder for development and testing purposes. It is not a legally reviewed document and should be customized with your specific policies, jurisdiction, and legal requirements before use in production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
