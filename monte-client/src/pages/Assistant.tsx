import React, { useState, useEffect } from 'react';
import TradingDataUpload from '../components/TradingDataUpload';
import AnalysisResults from '../components/AnalysisResults';
import ProFeatureGate from '../components/ProFeatureGate';
import { BarChart3, Brain, TrendingUp, AlertTriangle, Play, Loader } from 'lucide-react';

const Assistant = () => {
  const [hasData, setHasData] = useState(false);
  const [uploadData, setUploadData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleUploadSuccess = (data: any) => {
    setHasData(true);
    setUploadData(data);
    setAnalysisResult(null); // Clear previous analysis
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trading/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setAnalysisError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Check for existing analysis on component mount
  useEffect(() => {
    const checkExistingAnalysis = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/trading/analysis/latest', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setAnalysisResult({ ...result, summary: { total_trades: result.total_trades_analyzed } });
        }
      } catch (err) {
        // No existing analysis, that's fine
      }
    };

    checkExistingAnalysis();
  }, []);

  return (
    <ProFeatureGate
      feature="ai_assistant"
      title="AI Trading Assistant"
      description="Get personalized insights about your trading patterns, psychology, and performance with our GPT-4 powered AI assistant."
    >
      <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="h-10 w-10 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Trading Assistant
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Upload your trading history and get AI-powered insights about your trading patterns, 
          psychology, and performance metrics.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              1. Upload Your Trading Data
            </h2>
            
            <TradingDataUpload 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>

          {/* Analysis Section */}
          {hasData && !analysisResult && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                2. AI Analysis
              </h2>
              
              {!isAnalyzing ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Ready to analyze your trading data with AI
                  </p>
                  
                  <button
                    onClick={startAnalysis}
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Play className="h-5 w-5" />
                    <span>Start AI Analysis</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-pulse space-y-4">
                    <Loader className="h-12 w-12 text-blue-500 mx-auto animate-spin" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Analyzing your trading data...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      This may take up to 30 seconds
                    </p>
                  </div>
                </div>
              )}

              {/* Analysis Error */}
              {analysisError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Analysis Failed
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {analysisError}
                      </p>
                      
                      <button
                        onClick={startAnalysis}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Features & Info */}
        <div className="space-y-6">
          {/* What You'll Get */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What You'll Get
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BarChart3 className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Performance Metrics</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Win rate, profit factor, Sharpe ratio, and more
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Trading Patterns</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Best performing pairs, optimal trading times
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Brain className="h-5 w-5 text-purple-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Psychology Analysis</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Revenge trading, overtrading, emotional patterns
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Risk Assessment</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Position sizing, drawdown analysis, risk patterns
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Preview */}
          {uploadData && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Data Overview
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Format</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {uploadData.csv_type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">New Trades</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {uploadData.saved_trades}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duplicates</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {uploadData.duplicate_trades}
                  </span>
                </div>
                
                {uploadData.period?.start && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date Range</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(uploadData.period.start).toLocaleDateString()} - {' '}
                      {new Date(uploadData.period.end).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="mt-8">
          <AnalysisResults analysis={analysisResult} />
        </div>
      )}
      </div>
    </ProFeatureGate>
  );
};

export default Assistant;
