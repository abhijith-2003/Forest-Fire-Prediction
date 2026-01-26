import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, Wind, CloudRain, Flame, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import backgroundVideo from './assets/Background.mp4';

const App = () => {
  const [formData, setFormData] = useState({
    temp: '',
    rh: '',
    ws: '',
    rain: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const RANGES = {
    temp: { min: -20, max: 60, label: 'Temperature' },
    rh: { min: 0, max: 100, label: 'Humidity' },
    ws: { min: 0, max: 150, label: 'Wind Speed' },
    rain: { min: 0, max: 500, label: 'Rain' }
  };

  const validateField = (name, value) => {
    if (value === '') return null;
    const numValue = parseFloat(value);
    const range = RANGES[name];
    if (isNaN(numValue)) return 'Please enter a valid number';
    if (numValue < range.min || numValue > range.max) {
      return `${range.label} must be between ${range.min} and ${range.max}`;
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Allow only numeric characters, decimal point, and minus sign
    // Regex allows digits, one decimal point, and an optional leading minus
    const filteredValue = value.replace(/[^0-9.-]/g, '')
                               .replace(/(\..*)\./g, '$1') // Prevent multiple dots
                               .replace(/(?!^)-/g, '');    // Prevent minus sign anywhere but the start
                               
    setFormData(prev => ({ ...prev, [name]: filteredValue }));
    
    // Real-time validation
    const fieldError = validateField(name, filteredValue);
    setValidationErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation check
    const newErrors = {};
    let hasErrors = false;
    Object.keys(formData).forEach(key => {
      const fieldError = validateField(key, formData[key]);
      if (fieldError) {
        newErrors[key] = fieldError;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(newErrors);
      setError('Please correct the highlighted errors before analyzing.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temp: parseFloat(formData.temp),
          rh: parseFloat(formData.rh),
          ws: parseFloat(formData.ws),
          rain: parseFloat(formData.rain)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch prediction from server');
      }

      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ temp: '', rh: '', ws: '', rain: '' });
    setValidationErrors({});
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10 brightness-[0.4]"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Overlay for additional depth */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-3 bg-fire-orange/20 rounded-2xl mb-4"
          >
            <Flame className="w-8 h-8 text-fire-orange" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Fire Predictor
          </h1>
          <p className="text-gray-400 mt-2">AI-powered forest fire risk assessment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Groups */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" /> Temperature (°C)
              </label>
              <input
                required
                type="text"
                inputMode="decimal"
                name="temp"
                value={formData.temp}
                onChange={handleInputChange}
                placeholder="e.g. 32.5"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white glow-on-focus transition-all placeholder:text-gray-600 ${
                  validationErrors.temp ? 'border-red-500/50' : 'border-white/10'
                }`}
              />
              {validationErrors.temp && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.temp}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" /> Humidity (%)
              </label>
              <input
                required
                type="text"
                inputMode="decimal"
                name="rh"
                value={formData.rh}
                onChange={handleInputChange}
                placeholder="e.g. 45"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white glow-on-focus transition-all placeholder:text-gray-600 ${
                  validationErrors.rh ? 'border-red-500/50' : 'border-white/10'
                }`}
              />
              {validationErrors.rh && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.rh}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" /> Wind Speed (km/h)
              </label>
              <input
                required
                type="text"
                inputMode="decimal"
                name="ws"
                value={formData.ws}
                onChange={handleInputChange}
                placeholder="e.g. 15"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white glow-on-focus transition-all placeholder:text-gray-600 ${
                  validationErrors.ws ? 'border-red-500/50' : 'border-white/10'
                }`}
              />
              {validationErrors.ws && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.ws}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-indigo-400" /> Rain (mm)
              </label>
              <input
                required
                type="text"
                inputMode="decimal"
                name="rain"
                value={formData.rain}
                onChange={handleInputChange}
                placeholder="e.g. 0.2"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white glow-on-focus transition-all placeholder:text-gray-600 ${
                  validationErrors.rain ? 'border-red-500/50' : 'border-white/10'
                }`}
              />
              {validationErrors.rain && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.rain}</p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fire-orange to-fire-red py-4 rounded-xl font-bold text-lg shadow-lg shadow-fire-orange/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:brightness-110"
          >
            {loading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              'Analyze Probability'
            )}
          </motion.button>
        </form>

        {/* Result & Error Messages */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-10 p-6 rounded-2xl border flex items-center justify-between gap-4 ${
                result === 'Fire' 
                  ? 'bg-fire-red/10 border-fire-red/30 text-fire-red' 
                  : 'bg-green-500/10 border-green-500/30 text-green-400'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${result === 'Fire' ? 'bg-fire-red/20' : 'bg-green-400/20'}`}>
                  {result === 'Fire' ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <ShieldCheck className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium opacity-70">Prediction Result</p>
                  <h2 className="text-2xl font-bold uppercase tracking-wider">{result === 'Fire' ? 'High Risk' : 'Safe Area'}</h2>
                </div>
              </div>
              <button 
                onClick={resetForm}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="Reset Form"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-500 mt-8">
          Powered by Algerian Forest Fire Dataset & AI
        </p>
      </motion.div>
    </div>
  );
};

export default App;