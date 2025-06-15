/**
 * Multiple Image Upload Component
 * 
 * A reusable component for uploading and managing multiple images with drag and drop support.
 * Extends the existing ImageUpload pattern to handle arrays of images.
 */

import React, { useState, useRef, useCallback } from 'react';
import { PhotoIcon, XMarkIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { validateFile } from '../../utils/errorHandling';

interface MultipleImageUploadProps {
  label: string;
  name: string;
  value: (File | string)[];
  onChange: (files: (File | string)[]) => void;
  error?: string | undefined;
  required?: boolean;
  disabled?: boolean;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxFiles?: number;
  className?: string;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  label,
  name,
  value = [],
  onChange,
  error,
  required = false,
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFiles = 10,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList) => {
    const validFiles: File[] = [];
    const currentCount = value.length;

    for (let i = 0; i < files.length && (currentCount + validFiles.length) < maxFiles; i++) {
      const file = files[i];
      if (!file) continue;

      const validation = validateFile(file, {
        maxSize,
        allowedTypes
      });

      if (validation.valid) {
        validFiles.push(file);
      } else {
        console.error('File validation failed:', validation.error);
      }
    }

    if (validFiles.length > 0) {
      onChange([...value, ...validFiles]);
    }
  }, [value, onChange, maxSize, allowedTypes, maxFiles]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= value.length) return;

    const newFiles = [...value];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    if (movedFile) {
      newFiles.splice(toIndex, 0, movedFile);
      onChange(newFiles);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current && value.length < maxFiles) {
      fileInputRef.current.click();
    }
  };

  const getPreviewUrl = (file: File | string): string => {
    if (typeof file === 'string') {
      return file;
    }
    return URL.createObjectURL(file);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
        <span className="text-xs text-gray-500 ml-2">
          ({value.length}/{maxFiles} images)
        </span>
      </label>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {value.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={getPreviewUrl(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              
              {/* Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-1">
                {/* Move Up */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index - 1)}
                    className="p-1 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Move up"
                  >
                    <ArrowUpIcon className="h-3 w-3 text-gray-600" />
                  </button>
                )}
                
                {/* Move Down */}
                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index + 1)}
                    className="p-1 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Move down"
                  >
                    <ArrowDownIcon className="h-3 w-3 text-gray-600" />
                  </button>
                )}
                
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
              
              {/* Primary indicator */}
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxFiles && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragOver ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-300'}
            ${error ? 'border-red-300' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-gray-50'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            name={name}
            accept={allowedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
            multiple
          />

          <div>
            <div className="flex justify-center">
              {value.length === 0 ? (
                <PhotoIcon className="h-12 w-12 text-gray-400" />
              ) : (
                <PlusIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {isDragOver 
                  ? 'Drop images here' 
                  : value.length === 0 
                    ? 'Click to upload or drag and drop images'
                    : 'Add more images'
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB each
              </p>
            </div>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default MultipleImageUpload;
