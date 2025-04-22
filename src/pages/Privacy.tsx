import React from 'react';

const Privacy: React.FC = () => {
  const lastUpdated = 'June 6, 2024';
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: {lastUpdated}</p>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
          <p className="text-gray-700 mb-4">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use MindLink.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect personal information that you provide when registering for an account, such as your email address. We also collect data related to your use of MindLink, including your saved links and usage patterns.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use your information to provide and improve the MindLink service, communicate with you, and personalize your experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Data Storage and Security</h2>
          <p className="text-gray-700 mb-4">
            We store your data securely and use industry-standard practices to protect it from unauthorized access. However, no data transmission is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">
            MindLink may use cookies to enhance your user experience. You can disable cookies through your browser settings if you prefer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Sharing Your Information</h2>
          <p className="text-gray-700 mb-4">
            We do not sell or share your personal information with third parties, except as required by law or for the operation of the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to access, update, or delete your personal information. If you wish to exercise any of these rights, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            MindLink is not intended for users under the age of 13. We do not knowingly collect personal data from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Changes to the Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
          <p className="text-gray-700">
            If you have any questions or concerns about our Privacy Policy, please contact us at: hello@buildwithsds.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy; 