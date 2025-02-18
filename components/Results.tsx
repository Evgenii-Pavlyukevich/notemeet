import { useState } from 'react';
import { translations } from '@/lib/translations';
import styled from 'styled-components';

const ResultsContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
`;

const TabsContainer = styled.nav`
  display: flex;
  overflow-x: auto;
  background: #f8f9fa;
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem;
  gap: 0.5rem;

  @media (min-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }

  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  background: ${props => props.isActive ? 'black' : 'transparent'};
  color: ${props => props.isActive ? 'white' : 'var(--text-primary)'};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isActive ? 'black' : 'rgba(0, 0, 0, 0.05)'};
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentSection = styled.div`
  padding: 1.5rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const TranscriptionText = styled.p`
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 0.875rem;
  color: var(--text-primary);

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const SummaryText = styled.p`
  line-height: 1.6;
  font-size: 0.875rem;
  color: var(--text-primary);

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f3f5;
    transform: translateX(4px);
  }
`;

const ItemNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: black;
  color: white;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  flex-shrink: 0;
`;

const ItemText = styled.span`
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  flex: 1;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const EmptyState = styled.p`
  text-align: center;
  color: var(--placeholder-color);
  font-size: 0.875rem;
  padding: 2rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

interface ResultsProps {
  transcription?: string;
  summary?: string;
  decisions?: string[];
  actionItems?: string[];
  followUps?: string[];
  deadlines?: string[];
}

export function Results({
  transcription,
  summary,
  decisions,
  actionItems,
  followUps,
  deadlines,
}: ResultsProps) {
  const [activeTab, setActiveTab] = useState('transcription');

  const tabs = [
    { id: 'transcription', label: translations.results.tabs.transcription },
    { id: 'summary', label: translations.results.tabs.summary },
    { id: 'decisions', label: translations.results.tabs.decisions },
    { id: 'actions', label: translations.results.tabs.actions },
  ];

  const renderList = (items: string[] | undefined, emptyMessage: string) => {
    if (!items?.length) {
      return <EmptyState>{emptyMessage}</EmptyState>;
    }

    return (
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ItemNumber>{index + 1}</ItemNumber>
            <ItemText>{item}</ItemText>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <ResultsContainer>
      <TabsContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            isActive={activeTab === tab.id}
          >
            {tab.label}
          </Tab>
        ))}
      </TabsContainer>

      <ContentSection>
        {activeTab === 'transcription' && (
          <TranscriptionText>
            {transcription || translations.results.noData.transcription}
          </TranscriptionText>
        )}

        {activeTab === 'summary' && (
          <SummaryText>
            {summary || translations.results.noData.summary}
          </SummaryText>
        )}

        {activeTab === 'decisions' && (
          renderList(decisions, translations.results.noData.decisions)
        )}

        {activeTab === 'actions' && (
          renderList(actionItems, translations.results.noData.actions)
        )}
      </ContentSection>
    </ResultsContainer>
  );
} 