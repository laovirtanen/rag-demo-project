import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const QueryInterface = ({ onResponse, disabled }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading || disabled) return;

    const currentQuestion = question.trim();
    setQuestion(''); // Tyhjennä syöttökenttä
    setLoading(true);

    // Lisää käyttäjän kysymys chatiin
    onResponse({
      type: 'question',
      content: currentQuestion,
      timestamp: new Date()
    });

    try {
      const response = await axios.post(API_ENDPOINTS.query, {
        question: currentQuestion,
        limit: 5
      });

      // Lisää vastaus chatiin
      onResponse({
        type: 'answer',
        content: response.data.answer,
        context: response.data.context,
        question: currentQuestion,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Query error:', error);
      
      // Lisää virheviesti chatiin
      onResponse({
        type: 'error',
        content: error.response?.data?.error || 'Kysely epäonnistui. Yritä uudelleen.',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={disabled ? "Lataa ensin dokumentteja..." : "Kysy jotain dokumenteista..."}
            disabled={disabled || loading}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
              disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'
            }`}
          />
        </div>
        
        <button
          type="submit"
          disabled={!question.trim() || loading || disabled}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
            !question.trim() || loading || disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Ladataan...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Kysy</span>
            </>
          )}
        </button>
      </div>
      
      {disabled && (
        <p className="text-sm text-gray-500 mt-2 flex items-center">
          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
          Lataa dokumentteja kysyäksesi niistä kysymyksiä
        </p>
      )}
    </form>
  );
};

export default QueryInterface;
