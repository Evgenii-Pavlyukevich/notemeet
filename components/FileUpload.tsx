import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { translations } from '@/lib/translations';

const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'video/mp4', 'video/webm'];
const MAX_SIZE = 25 * 1024 * 1024; // 25MB

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

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
    <div
      {...getRootProps()}
      className={`upload-area ${isDragActive ? 'border-gray-400 bg-gray-50' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="upload-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4v16m-8-8h16" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="upload-text">
        {file ? `${translations.fileUpload.selectedFile} ${file.name}` : translations.fileUpload.dragAndDrop}
      </p>
      <p className="upload-subtext">
        {translations.fileUpload.supportedFormats}
      </p>
    </div>
  );
} 