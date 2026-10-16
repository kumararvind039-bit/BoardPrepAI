import React, { useState } from 'react';
import { useApiKey } from '../context/ApiKeyContext';

export default function ApiKeySettings() {
  const { apiKey, setApiKey } = useApiKey();
  const [inputVal, setInputVal] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(inputVal.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border max-w-xl mx-auto my-4">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Google Gemini API Key (BYOK)</h3>
      <p className="text-xs text-gray-500 mb-4">
        Your key remains safely stored in your browser local storage and is never sent to any intermediary server.
      </p>
      <form onSubmit={handleSave} className="flex gap-2">
        <input
          type="password"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="AQ.Ab8RN6Iw245d_meQOVJ3lntLWh6pX3FtkY2qqh5Bg9SDFsZELg"
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-750 transition-colors"
        >
          Save Key
        </button>
      </form>
      {saved && <p className="text-xs text-green-600 mt-2 font-medium">✓ API Key updated successfully!</p>}
    </div>
  );
}
