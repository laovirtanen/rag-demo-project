import React, { useEffect, useRef } from 'react';
import { User, Bot, AlertCircle, Clock, FileText } from 'lucide-react';

const ChatHistory = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fi-FI', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (messages.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
        <div className="text-center">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Keskustelu näkyy tässä kun esität kysymyksiä</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
      {messages.map((message) => (
        <div key={message.id} className="animate-slide-up">
          
          {/* User Question */}
          {message.type === 'question' && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <p className="text-gray-800">{message.content}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Answer */}
          {message.type === 'answer' && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Context Sources */}
                  {message.context && message.context.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <FileText className="w-3 h-3 mr-1" />
                        Lähteet ({message.context.length} tekstipätkää):
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {message.context.map((ctx, idx) => (
                          <div key={idx} className="text-xs bg-gray-50 p-2 rounded border">
                            <div className="text-gray-600 truncate">
                              {ctx.content.substring(0, 100)}...
                            </div>
                            {ctx.distance && (
                              <div className="text-gray-400 mt-1">
                                Samankaltaisuus: {(1 - ctx.distance).toFixed(3)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {message.type === 'error' && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{message.content}</p>
                  <div className="flex items-center mt-2 text-xs text-red-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatHistory;
