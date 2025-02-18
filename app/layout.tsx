import type { Metadata } from 'next';
import './globals.css';
import StyledComponentsRegistry from './registry';

export const metadata: Metadata = {
  title: 'VideoNotes',
  description: 'Автоматизация, расшифровка, обобщение и постановка задач из видео-конференций',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
} 