import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  const lastUpdated = 'June 6, 2024';
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: {lastUpdated}</p>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
          <p className="text-gray-700 mb-4">
            Welcome to MindLink! These Terms of Service govern your use of our platform. By using MindLink, you agree to comply with these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing or using MindLink, you agree to these Terms of Service. If you do not agree, please refrain from using the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Account Registration</h2>
          <p className="text-gray-700 mb-4">
            To access certain features of MindLink, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Use of Service</h2>
          <p className="text-gray-700 mb-4">
            You agree to use MindLink only for lawful purposes and in accordance with the terms outlined here.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">User Content</h2>
          <p className="text-gray-700 mb-4">
            You retain ownership of any links or content you upload to MindLink. However, by using the service, you grant us a license to process and store that content for the purposes of organizing and categorizing it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Privacy and Data Security</h2>
          <p className="text-gray-700 mb-4">
            MindLink is committed to safeguarding your personal data. Please review our <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</Link> for details on how we collect, use, and protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Limitations of Liability</h2>
          <p className="text-gray-700 mb-4">
            MindLink is not liable for any loss of data, profits, or damages arising from the use or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Termination</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to suspend or terminate your account if we believe you have violated the terms of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We may update these Terms of Service from time to time. Any changes will be reflected here, and you are encouraged to review them periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
          <p className="text-gray-700">
            For any questions or concerns regarding these Terms of Service, please contact us at: hello@buildwithsds.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms; 