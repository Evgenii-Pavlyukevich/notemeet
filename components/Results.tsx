import { useState } from 'react';
import { translations } from '@/lib/translations';

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
    { id: 'transcription', label: translations.results.tabs.transcription },
    { id: 'summary', label: translations.results.tabs.summary },
    { id: 'decisions', label: translations.results.tabs.decisions },
    { id: 'actions', label: translations.results.tabs.actions },
  ];

  return (
    <div className="notion-card">
      <div className="notion-tabs">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`notion-tab ${activeTab === tab.id ? 'notion-tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'transcription' && (
          <div className="notion-block">
            <p className="whitespace-pre-wrap">{transcription || translations.results.noData.transcription}</p>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="notion-block">
            <p>{summary || translations.results.noData.summary}</p>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="notion-block">
            {decisions?.length ? (
              <ul className="space-y-2">
                {decisions.map((decision, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-hover-bg text-text-primary">
                      {index + 1}
                    </span>
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="opacity-60">{translations.results.noData.decisions}</p>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="notion-block">
            {actionItems?.length ? (
              <ul className="space-y-4">
                {actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-hover-bg text-text-primary">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="opacity-60">{translations.results.noData.actions}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 