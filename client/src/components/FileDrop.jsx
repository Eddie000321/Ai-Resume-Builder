import { useCallback, useRef, useState } from 'react';

export function FileDrop({ label = 'Drop PDF here', onFileSelect }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      if (!files?.length) return;
      const file = files[0];
      if (file.type !== 'application/pdf') {
        alert('PDF files only');
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
        isDragging ? 'border-brand bg-brand/10' : 'border-slate-300 bg-white'
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      role="presentation"
    >
      <p className="text-lg font-semibold text-slate-800">{label}</p>
      <p className="mt-2 text-sm text-slate-500">Max 5MB · PDF only</p>
      <button
        type="button"
        className="mt-6 rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-md"
        onClick={() => inputRef.current?.click()}
      >
        Browse Files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}
