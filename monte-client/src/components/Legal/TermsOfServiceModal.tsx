import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ScrollShadow } from '@nextui-org/react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
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
          <h1 className="text-2xl font-bold">Terms of Service</h1>
        </ModalHeader>
        <ModalBody className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
          <div className="h-full overflow-y-auto px-6 py-4 bg-white dark:bg-gray-900">
            <div className="prose dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using this trading Monte Carlo simulation platform, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Data Usage and Analytics</h2>
                <p>By using our service, you understand and consent that:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>We collect and analyze your trading data to provide simulation services</li>
                  <li>Your trading patterns and performance data will be processed to generate Monte Carlo simulations</li>
                  <li>Aggregated and anonymized data may be used to improve our services</li>
                  <li>We do not share your personal trading data with third parties without your explicit consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. Service Description</h2>
                <p>Our platform provides Monte Carlo simulation services for trading analysis, including:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Portfolio performance projections</li>
                  <li>Risk assessment calculations</li>
                  <li>Trading strategy backtesting</li>
                  <li>Statistical analysis of trading patterns</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. User Responsibilities</h2>
                <p>You agree to:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Provide accurate trading data for analysis</li>
                  <li>Use the service for legitimate trading analysis purposes</li>
                  <li>Not attempt to reverse engineer or misuse our algorithms</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your data, but you acknowledge that no system is completely secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Service Availability</h2>
                <p>
                  We strive to maintain service availability but do not guarantee uninterrupted access.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
                <p>
                  Our simulations are for educational and analytical purposes. Trading decisions based on our analysis are your responsibility.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">8. Modifications</h2>
                <p>
                  We reserve the right to modify these terms. Users will be notified of significant changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
                <p>
                  Either party may terminate this agreement at any time.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">10. Governing Law</h2>
                <p>
                  These terms are governed by applicable international laws.
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

export default TermsOfServiceModal;