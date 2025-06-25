
import { useContext } from 'react';
import { ErrorContext } from '../context/ErrorContext';

const ErrorBanner = () => {
  const { error, setError } = useContext(ErrorContext);

  if (!error) return null;

  return (
    <div
      style={{
        backgroundColor: '#ffcccc',
        color: '#990000',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
      }}
    >
      {error}
      <button
        style={{ marginLeft: '20px' }}
        onClick={() => setError(null)}
      >
        閉じる
      </button>
    </div>
  );
};

export default ErrorBanner;
