import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

interface TradingDataUploadProps {
  onUploadSuccess: (data: any) => void;
  onUploadError: (error: string) => void;
}

interface UploadResult {
  message: string;
  csv_type: string;
  total_rows: number;
  saved_trades: number;
  duplicate_trades: number;
  period: {
    start: string | null;
    end: string | null;
  };
}

const TradingDataUpload: React.FC<TradingDataUploadProps> = ({
  onUploadSuccess,
  onUploadError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/trading/import-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const result = await response.json();
      setUploadResult(result);
      onUploadSuccess(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const clearResults = () => {
    setUploadResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload className={`h-12 w-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isUploading ? 'Uploading...' : 'Upload Trading Data'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isDragActive 
                ? 'Drop your CSV file here' 
                : 'Drag & drop your CSV file here, or click to select'
              }
            </p>
          </div>
          
          <div className="text-xs text-gray-400 dark:text-gray-500">
            <p>Supported formats:</p>
            <ul className="mt-1 space-y-1">
              <li>• Binance Spot Trading History</li>
              <li>• Binance Futures Trading History</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isUploading && (
        <div className="flex items-center justify-center space-x-2 p-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Processing your trading data...
          </span>
        </div>
      )}

      {/* Success Result */}
      {uploadResult && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Upload Successful!
              </h3>
              
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Format:</strong> {uploadResult.csv_type.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Total Rows:</strong> {uploadResult.total_rows}</p>
                  </div>
                  <div>
                    <p><strong>New Trades:</strong> {uploadResult.saved_trades}</p>
                    <p><strong>Duplicates:</strong> {uploadResult.duplicate_trades}</p>
                  </div>
                </div>
                
                {uploadResult.period.start && uploadResult.period.end && (
                  <div className="mt-2">
                    <p><strong>Date Range:</strong></p>
                    <p className="text-xs">
                      {new Date(uploadResult.period.start).toLocaleDateString()} - {' '}
                      {new Date(uploadResult.period.end).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              
              <button
                onClick={clearResults}
                className="mt-3 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Upload Failed
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
              
              <button
                onClick={clearResults}
                className="mt-2 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              How to Export Your Trading Data
            </h3>
            
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <div>
                <p className="font-medium">Binance:</p>
                <ol className="text-xs list-decimal list-inside ml-2 space-y-1">
                  <li>Go to Orders → Trade History</li>
                  <li>Select date range and trading pair (or leave empty for all)</li>
                  <li>Click "Export Complete Trade History"</li>
                  <li>Download the CSV file</li>
                </ol>
              </div>
              
              <div>
                <p className="font-medium">Supported Data:</p>
                <ul className="text-xs list-disc list-inside ml-2 space-y-1">
                  <li>Spot trading history</li>
                  <li>Futures trading history</li>
                  <li>Trade times, quantities, prices</li>
                  <li>Fees and commissions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDataUpload;