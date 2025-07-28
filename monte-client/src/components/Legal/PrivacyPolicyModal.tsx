import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ScrollShadow } from '@nextui-org/react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="5xl"
      backdrop="opaque"
      classNames={{
        base: "max-w-4xl max-h-[85vh]",
        wrapper: "items-center justify-center",
        body: "p-0",
        header: "border-b border-gray-200 dark:border-gray-700",
        footer: "border-t border-gray-200 dark:border-gray-700"
      }}
    >
      <ModalContent className="bg-white dark:bg-gray-900 h-[85vh] flex flex-col">
        <ModalHeader className="flex-shrink-0 px-6 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
        </ModalHeader>
        <ModalBody className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
          <div className="h-full overflow-y-auto px-6 py-4 bg-white dark:bg-gray-900">
            <div className="prose dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                <p>We collect:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Account information (email, username)</li>
                  <li>Trading data you upload for analysis</li>
                  <li>Usage analytics and performance metrics</li>
                  <li>Technical data (IP address, browser information)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Provide Monte Carlo simulation services</li>
                  <li>Analyze trading patterns and performance</li>
                  <li>Improve our algorithms and services</li>
                  <li>Communicate important service updates</li>
                  <li>Ensure platform security</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. Data Processing Legal Basis</h2>
                <p>We process your data based on:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Your consent for trading data analysis</li>
                  <li>Contractual necessity to provide services</li>
                  <li>Legitimate interests in service improvement</li>
                  <li>Legal obligations for security and compliance</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Data Sharing</h2>
                <p>We do not sell your personal data. We may share:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Aggregated, anonymized statistics for research</li>
                  <li>Information required by law or legal process</li>
                  <li>Data with service providers under strict confidentiality agreements</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
                <p>We implement:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Encryption for data transmission and storage</li>
                  <li>Access controls and authentication</li>
                  <li>Regular security audits and updates</li>
                  <li>Incident response procedures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request data deletion</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                  <li>Lodge complaints with supervisory authorities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">7. Data Retention</h2>
                <p>We retain your data:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Account data: Until account deletion</li>
                  <li>Trading data: As long as needed for service provision</li>
                  <li>Analytics data: Up to 3 years for service improvement</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">8. International Transfers</h2>
                <p>
                  Your data may be processed in countries with adequate data protection standards.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">9. Cookies and Tracking</h2>
                <p>
                  We use essential cookies for service functionality and analytics cookies with your consent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">10. Contact Information</h2>
                <p>
                  For privacy concerns, contact us at: <a href="mailto:privacy@trading-monte-carlo.com" className="text-blue-600 hover:underline">privacy@trading-monte-carlo.com</a>
                </p>
              </section>

              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: January 2025
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex-shrink-0 px-6 py-4 bg-white dark:bg-gray-900">
          <Button 
            color="primary" 
            onPress={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PrivacyPolicyModal;