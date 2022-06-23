import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>Ooops...</h1>
      <h2>That page cannot be found :(</h2>
      <p>
        Go to{' '}
        <Link href="/jobs">
          <a>Jobs</a>
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
