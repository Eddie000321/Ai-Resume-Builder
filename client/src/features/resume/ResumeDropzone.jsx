import { useNavigate } from 'react-router-dom';
import { FileDrop } from '../../components/FileDrop';
import { useResumeDraft } from '../../context/ResumeDraftContext';

export function ResumeDropzone() {
  const { setFile } = useResumeDraft();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl">
      <FileDrop
        label="Drop your résumé (PDF)"
        onFileSelect={(file) => {
          setFile(file);
          navigate('/auth', { replace: false });
        }}
      />
      <p className="mt-4 text-center text-sm text-slate-500">
        Login or create an account to continue with the analysis.
      </p>
    </div>
  );
}
