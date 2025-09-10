import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/formatSize";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024; // 20MB

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: maxFileSize,
    disabled: !!selectedFile,
  });

  return (
    <div className="w-full gradient-border" {...getRootProps()}>
      <input {...getInputProps()} key={inputKey} />
      <div className="space-y-4 cursor-pointer">
        {selectedFile ? (
          <div
            className="uploader-selected-file"
            onClick={(e) => e.stopPropagation()}
          >
            <img src="./images/pdf.png" alt="PDF" className="size-10" />
            <div className="flex flex-center space-x-3">
              <div>
                <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  <span className="font-semibold">Uploaded File:</span>{" "}
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Size:</span>{" "}
                  {formatSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              className="p-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                setInputKey((k) => k + 1);
                onFileSelect?.(null);
              }}
            >
              <img
                src="./images/icons/cross.svg"
                alt="Remove"
                className="w-4 h-4"
              />
            </button>
          </div>
        ) : (
          <div>
            <div className="mx-auto w-16 h-16 flex items-center justify-center">
              <img
                src="./images/icons/info.svg"
                alt="Upload"
                className="size-20"
              />
            </div>
            <p className="text-lg text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-lg text-gray-500">
              PDF (max {formatSize(maxFileSize)})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
