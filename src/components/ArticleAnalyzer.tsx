"use client";

import { useState } from 'react';
import axios from 'axios';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const ArticleAnalyzer = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [fixedArticle, setFixedArticle] = useState('');
  const [error, setError] = useState('');
  const [showRenderButton, setShowRenderButton] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await axios.post('/api/analyze', { text: input });
      console.log('Full API Response:', result.data);
      const processedContent = await remark().use(remarkHtml).process(result.data.analysis);
      setResponse(String(processedContent));
      setError(''); // Clear any previous errors
      setShowRenderButton(true); // Show the Render button after output is printed
    } catch (error) {
      console.error('Error analyzing text:', error);
      setError('An error occurred while analyzing the article. Please try again.');
    }
  };

  const handleRender = async () => {
    try {
      const renderResult = await axios.post('/api/render', { text: input });
      console.log('Render API Response:', renderResult.data);
      const processedFixedArticle = await remark().use(remarkHtml).process(renderResult.data.fixed);
      setFixedArticle(String(processedFixedArticle));
    } catch (error) {
      console.error('Error rendering text:', error);
      setError('An error occurred while rendering the article. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
      <style jsx>{`
        .analysis-content p {
          margin-bottom: 1rem;
        }
        .analysis-content p:first-child {
          margin-top: 0;
        }
        .analysis-content {
          white-space: pre-wrap;
        }
      `}</style>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-4xl font-extrabold text-gray-900">Prism</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Delve into your article draft to increase accuracy and improve reasoning
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="10"
            placeholder="Paste your article here"
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Delve
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {response && (
          <div className="mt-4 p-4 border border-gray-300 rounded-md bg-white shadow-sm">
            <div className="mt-2 text-sm text-gray-700 analysis-content" dangerouslySetInnerHTML={{ __html: response }}></div>
          </div>
        )}
        {showRenderButton && (
          <button
            onClick={handleRender}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Render
          </button>
        )}
        {fixedArticle && (
          <div className="mt-4 p-4 border border-gray-300 rounded-md bg-white shadow-sm">
            <div className="mt-2 text-sm text-gray-700 analysis-content" dangerouslySetInnerHTML={{ __html: fixedArticle }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleAnalyzer;
