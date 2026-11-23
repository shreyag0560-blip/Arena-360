import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container section narrow">
      <div className="empty">
        <p className="eyebrow">Error 404</p>
        <h1>Out of bounds</h1>
        <p>We couldn't find that page or booking.</p>
        <Link to="/" className="btn btn-dark">Back to home</Link>
      </div>
    </div>
  );
}
