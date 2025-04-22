import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PromptEditor() {
  const [prompt, setPrompt] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState('');

  const handleAddVariable = () => {
    if (newVariable && !variables.includes(newVariable)) {
      setVariables([...variables, newVariable]);
      setNewVariable('');
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };

  const handleSave = () => {
    // Handle saving the prompt and variables
    console.log('Saving prompt:', prompt);
    console.log('Variables:', variables);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Prompt Editor</h1>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-500"
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                    Prompt Template
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="prompt"
                      name="prompt"
                      rows={6}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter your prompt template here..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="variables" className="block text-sm font-medium text-gray-700">
                    Variables
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="variables"
                      id="variables"
                      value={newVariable}
                      onChange={(e) => setNewVariable(e.target.value)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                      placeholder="Add a variable"
                    />
                    <button
                      type="button"
                      onClick={handleAddVariable}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  {variables.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {variables.map((variable) => (
                        <span
                          key={variable}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {variable}
                          <button
                            type="button"
                            onClick={() => handleRemoveVariable(variable)}
                            className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                          >
                            <span className="sr-only">Remove variable</span>
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Prompt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 