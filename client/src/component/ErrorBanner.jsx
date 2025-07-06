
import { useContext } from 'react';
import { ErrorContext } from '../context/ErrorContext';

const ErrorBanner = () => {
  const { error, setError } = useContext(ErrorContext);

  if (!error) return null;

  return (
    // <div
    //   style={{
    //     backgroundColor: '#ffcccc',
    //     color: '#990000',
    //     padding: '10px',
    //     margin: '10px 0',
    //     borderRadius: '4px',
    //   }}
    // >
    //   {error}
    //   <button
    //     style={{ marginLeft: '20px' }}
    //     onClick={() => setError(null)}
    //   >
    //     閉じる
    //   </button>
    // </div>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
      <strong class="font-bold">{error}</strong><br />
      <button style={{ marginLeft: '20px' }} onClick={() => setError(null)}>
        閉じる
      </button>
      <span class="block sm:inline">Something seriously bad happened.</span>
    </div>

  );
};

export default ErrorBanner;
