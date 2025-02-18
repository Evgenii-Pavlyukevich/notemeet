import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { translations } from '@/lib/translations';
import styled from 'styled-components';

const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'video/mp4', 'video/webm'];
const MAX_SIZE = 25 * 1024 * 1024; // 25MB

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const UploadArea = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${props => props.isDragActive ? '#000' : '#ccc'};
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  background: ${props => props.isDragActive ? 'var(--hover-bg)' : '#fafafa'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #666;
    background: var(--hover-bg);
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const UploadIcon = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  opacity: 0.5;

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    margin-bottom: 1.5rem;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const UploadText = styled.p`
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
`;

const UploadSubtext = styled.p`
  color: var(--placeholder-color);
  font-size: 0.8rem;

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

export function FileUpload({ file, onFileChange }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(translations.fileUpload.errors.unsupportedType);
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error(translations.fileUpload.errors.sizeLimit);
      return;
    }
    onFileChange(file);
    toast.success(translations.fileUpload.errors.uploadSuccess);
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'audio/*': ['.mp3', '.m4a', '.wav'],
      'video/*': ['.mp4', '.webm'],
    },
  });

  return (
    <UploadArea {...getRootProps()} isDragActive={isDragActive}>
      <input {...getInputProps()} />
      <UploadIcon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4v16m-8-8h16" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </UploadIcon>
      <UploadText>
        {file ? `${translations.fileUpload.selectedFile} ${file.name}` : translations.fileUpload.dragAndDrop}
      </UploadText>
      <UploadSubtext>
        {translations.fileUpload.supportedFormats}
      </UploadSubtext>
    </UploadArea>
  );
} 