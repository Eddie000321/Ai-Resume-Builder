import { createContext, useContext, useMemo, useState } from 'react';

const ResumeDraftContext = createContext(null);

export function ResumeDraftProvider({ children }) {
  const [file, setFile] = useState(null);
  const value = useMemo(
    () => ({
      file,
      setFile,
      clear: () => setFile(null),
    }),
    [file]
  );
  return <ResumeDraftContext.Provider value={value}>{children}</ResumeDraftContext.Provider>;
}

export function useResumeDraft() {
  const ctx = useContext(ResumeDraftContext);
  if (!ctx) {
    throw new Error('useResumeDraft must be used within ResumeDraftProvider');
  }
  return ctx;
}
