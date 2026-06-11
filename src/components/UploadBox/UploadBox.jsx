import { useRef, useState } from 'react';
import { formatBytes } from '../../utils/format.js';
import './UploadBox.css';

/** Drag-and-drop upload area with simple file size guard. */
export default function UploadBox({
  label = 'Upload File',
  hint = 'PDF, PNG, JPG up to 5 MB',
  maxMB = 5,
  onFile,
}) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);

  const accept = (f) => {
    if (!f) return;
    if (f.size > maxMB * 1024 * 1024) {
      alert(`Max ${maxMB} MB`);
      return;
    }
    setFile(f);
    onFile?.(f);
  };

  return (
    <div>
      <button
        type="button"
        className={`upload-box ${drag ? 'drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          accept(e.dataTransfer.files?.[0]);
        }}
      >
        <div className="up-ico" aria-hidden="true">📎</div>
        <div className="up-txt">{label}</div>
        <div className="up-sub">{hint}</div>
      </button>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => accept(e.target.files?.[0])}
      />
      {file && (
        <div className="uploaded-file">
          <span aria-hidden="true">📄</span>
          <div className="f-name">{file.name} · {formatBytes(file.size)}</div>
          <button
            type="button"
            className="f-del"
            onClick={() => { setFile(null); onFile?.(null); }}
            aria-label="Remove file"
          >×</button>
        </div>
      )}
    </div>
  );
}
