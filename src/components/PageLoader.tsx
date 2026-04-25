import { type JSX } from 'react';
export function PageLoader(): JSX.Element {
  return (
    <div className="page-loader">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
