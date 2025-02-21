import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { translations } from '@/lib/translations';
import styled from 'styled-components';
import { uploadLargeFile } from '@/lib/supabase';

const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'video/mp4', 'video/webm'];
const MAX_SIZE = 25 * 1024 * 1024; // 25MB
const LARGE_FILE_THRESHOLD = 50 * 1024 * 1024; // 50MB

const UploadArea = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${props => props.isDragActive ? '#000' : '#ccc'};
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  background: ${props => props.isDragActive ? 'var(--hover-bg)' : '#fafafa'};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;

  &:hover {
    border-color: #666;
    background: var(--hover-bg);
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const UploadIcon = styled.div`
  width: 36px;
  height: 36px;
  margin: 0 auto 1rem;
  opacity: 0.5;

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const UploadText = styled.p`
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const UploadSubtext = styled.p`
  color: var(--placeholder-color);
  font-size: 0.75rem;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function FileUpload({ file, onFileChange }: FileUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(translations.fileUpload.errors.unsupportedType);
      return;
    }

    try {
      if (file.size > LARGE_FILE_THRESHOLD) {
        // For large files, upload to Supabase first
        const fileName = await uploadLargeFile(file);
        // Create a new File object with the same properties but smaller size
        const tempFile = new File(
          [new Blob(['temp_file'])],
          file.name,
          { type: file.type }
        );
        // Store the Supabase reference in a custom property
        Object.defineProperty(tempFile, 'supabaseRef', {
          value: fileName,
          writable: false
        });
        onFileChange(tempFile);
      } else if (file.size > MAX_SIZE) {
        toast.error(translations.fileUpload.errors.sizeLimit);
        return;
      } else {
        onFileChange(file);
      }
      toast.success(translations.fileUpload.errors.uploadSuccess);
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload large file');
      onFileChange(null);
    }
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
