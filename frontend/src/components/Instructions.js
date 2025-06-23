import React, { useState } from 'react';
import { Info, Upload, MessageCircle, Shield, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

function Instructions() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-card rounded-xl p-6 mb-8 border-l-4 border-blue-500">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">AskMyDocs - Käyttöohjeet</h2>
            <p className="text-sm text-gray-600">Klikkaa nähdäksesi ohjeet ja tärkeät tiedot</p>
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6 animate-fadeIn">
          
          {/* Demo Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Tietoa demosta</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Tämä on <strong>Retrieval Augmented Generation (RAG)</strong> demo-sovellus. 
                  Se mahdollistaa dokumenttien lataamisen ja niiden sisällön perusteella kysymysten esittämisen AI:lle.
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
              Miten se toimii?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full mr-2">1</span>
                  <Upload className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-medium text-green-900 mb-1">Lataa dokumentti</h4>
                <p className="text-green-800 text-xs">PDF tai TXT tiedosto pilkotaan osiin ja tallennetaan vektoritietokantaan</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full mr-2">2</span>
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-medium text-blue-900 mb-1">Esitä kysymys</h4>
                <p className="text-blue-800 text-xs">Järjestelmä hakee relevanteimmat tekstikappaleet kysymyksesi perusteella</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full mr-2">3</span>
                  <Info className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-medium text-purple-900 mb-1">Saa vastauksen</h4>
                <p className="text-purple-800 text-xs">AI vastaa kysymykseen perustuen lataamiisi dokumentteihin</p>
              </div>
            </div>
          </div>

          {/* Security Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900 mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  TÄRKEÄ TURVALLISUUSHUOMAUTUS
                </h3>
                <div className="text-red-800 text-sm space-y-2">
                  <p><strong>ÄLÄ lataa arkaluontoisia dokumentteja:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Henkilötietoja sisältäviä dokumentteja</li>
                    <li>Liikesalaisuuksia tai luottamuksellista tietoa</li>
                    <li>Salasanoja, avaimia tai tunnistetietoja</li>
                    <li>Juridisia tai lääketieteellisiä asiakirjoja</li>
                  </ul>
                  <p className="font-medium">Tämä on julkinen demo-ympäristö!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">💡 Vinkkejä parhaaseen kokemukseen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-gray-700 text-sm">📄 Käytä selkeitä, hyvin jäsenneltyjä dokumentteja</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-gray-700 text-sm">❓ Esitä tarkkoja, yksityiskohtaisia kysymyksiä</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-gray-700 text-sm">📝 PDF- ja TXT-tiedostot toimivat parhaiten</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-gray-700 text-sm">🔍 Viittaa dokumentin sisältöön kysymyksissäsi</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Instructions;
