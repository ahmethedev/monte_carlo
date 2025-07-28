import React, { useState } from 'react';
import TermsOfServiceModal from './TermsOfServiceModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';

interface TermsAcceptanceProps {
  onAcceptance: (termsAccepted: boolean, privacyAccepted: boolean) => void;
  required?: boolean;
  className?: string;
}

const TermsAcceptance: React.FC<TermsAcceptanceProps> = ({ 
  onAcceptance, 
  required = true,
  className = ""
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  React.useEffect(() => {
    onAcceptance(termsAccepted, privacyAccepted);
  }, [termsAccepted, privacyAccepted, onAcceptance]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="terms-checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          required={required}
        />
        <label htmlFor="terms-checkbox" className="text-sm text-gray-700 dark:text-gray-300">
          I agree to the{' '}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-blue-600 hover:underline font-medium"
          >
            Terms of Service
          </button>
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="privacy-checkbox"
          checked={privacyAccepted}
          onChange={(e) => setPrivacyAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          required={required}
        />
        <label htmlFor="privacy-checkbox" className="text-sm text-gray-700 dark:text-gray-300">
          I agree to the{' '}
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="text-blue-600 hover:underline font-medium"
          >
            Privacy Policy
          </button>
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {required && (!termsAccepted || !privacyAccepted) && (
        <p className="text-xs text-red-500">
          You must accept both the Terms of Service and Privacy Policy to continue.
        </p>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        By accepting these terms, you consent to our collection and use of your trading data 
        for simulation and analysis purposes as described in our Privacy Policy.
      </div>

      <TermsOfServiceModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
      
      <PrivacyPolicyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </div>
  );
};

export default TermsAcceptance;