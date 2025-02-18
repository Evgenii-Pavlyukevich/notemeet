import { useState } from 'react';

interface ResultsProps {
  transcription?: string;
  summary?: string;
  decisions?: string[];
  actionItems?: string[];
  followUps?: string[];
  deadlines?: string[];
}

export function Results({ transcription, summary, decisions, actionItems, followUps, deadlines }: ResultsProps) {
  const [activeTab, setActiveTab] = useState('transcription');

  const tabs = [
    { id: 'transcription', label: 'Transcription' },
    { id: 'summary', label: 'Summary' },
    { id: 'decisions', label: 'Key Decisions' },
    { id: 'actions', label: 'Action Items' },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'transcription' && (
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{transcription || 'No transcription available'}</p>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="prose max-w-none">
            <p>{summary || 'No summary available'}</p>
          </div>
        )}

        {activeTab === 'decisions' && (
          <ul className="space-y-2">
            {decisions?.map((decision, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {index + 1}
                </span>
                <span className="ml-3">{decision}</span>
              </li>
            )) || <p>No decisions recorded</p>}
          </ul>
        )}

        {activeTab === 'actions' && (
          <ul className="space-y-4">
            {actionItems?.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                  {index + 1}
                </span>
                <span className="ml-3">{item}</span>
              </li>
            )) || <p>No action items recorded</p>}
          </ul>
        )}
      </div>
    </div>
  );
} 