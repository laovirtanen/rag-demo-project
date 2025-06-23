import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import QueryInterface from './components/QueryInterface';
import ChatHistory from './components/ChatHistory';
import Instructions from './components/Instructions';
import { Upload, MessageCircle, Brain } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, { ...message, id: Date.now() }]);
  };

  const addUploadedFile = (file) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="backdrop-blur-lg bg-white/20 border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  AskMyDocs
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Retrieval Augmented Generation
                </p>
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Instructions />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* File Upload */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Upload className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-800">Lataa dokumentit</h2>
              </div>
              
              <FileUpload onFileUploaded={addUploadedFile} />
              
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Ladatut tiedostot:</h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-800 truncate">
                            {file.filename}
                          </p>
                          <p className="text-xs text-green-600">
                            {file.chunkCount} chunkkia
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Query and Chat Section */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <MessageCircle className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-800">Kysy dokumenteista</h2>
              </div>
              
              <div className="space-y-6">
                <ChatHistory messages={messages} />
                
                <QueryInterface 
                  onResponse={addMessage} 
                  disabled={uploadedFiles.length === 0}
                />
                
                {uploadedFiles.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    </div>
                    <p className="text-gray-500">
                      Lataa ensin dokumentteja kysyäksesi niistä kysymyksiä
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
