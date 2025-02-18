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
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <p className="text-gray-600">
          {file ? `${translations.fileUpload.selectedFile} ${file.name}` : translations.fileUpload.dragAndDrop}
        </p>
        <p className="text-sm text-gray-500">
          {translations.fileUpload.supportedFormats}
        </p>
      </div>
    </div>
  );
} 