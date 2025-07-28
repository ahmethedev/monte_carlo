import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import TermsAcceptance from './TermsAcceptance';
import { acceptTerms } from '../../services/authService';

interface TermsAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccepted: () => void;
}

const TermsAcceptanceModal: React.FC<TermsAcceptanceModalProps> = ({
  isOpen,
  onClose,
  onAccepted
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptance = (terms: boolean, privacy: boolean) => {
    setTermsAccepted(terms);
    setPrivacyAccepted(privacy);
  };

  const handleSubmit = async () => {
    if (!termsAccepted || !privacyAccepted) {
      setError('You must accept both the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await acceptTerms(termsAccepted, privacyAccepted);
      onAccepted();
      onClose();
    } catch (err) {
      setError('Failed to save your acceptance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      isDismissable={false}
      hideCloseButton={true}
      backdrop="opaque"
    >
      <ModalContent className="bg-white dark:bg-gray-900">
        <ModalHeader className="flex flex-col gap-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <h2 className="text-xl font-semibold">Terms and Privacy Policy Update</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We've updated our terms and privacy policy. Please review and accept to continue using our service.
          </p>
        </ModalHeader>
        <ModalBody className="bg-white dark:bg-gray-900">
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                What's new in our Terms and Privacy Policy?
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Enhanced data protection measures</li>
                <li>• Clearer explanation of how we use your trading data</li>
                <li>• Updated user rights and responsibilities</li>
                <li>• Improved transparency in our data handling practices</li>
              </ul>
            </div>

            <TermsAcceptance
              onAcceptance={handleAcceptance}
              required={true}
              className="border-t pt-4"
            />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="bg-white dark:bg-gray-900">
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={!termsAccepted || !privacyAccepted}
            className="w-full"
          >
            Accept and Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TermsAcceptanceModal;