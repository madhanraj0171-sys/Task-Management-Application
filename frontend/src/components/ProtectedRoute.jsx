import React from 'react';

/**
 * ProtectedRoute component:
 * Checks if user authentication token exists.
 * If not authenticated, redirects user to Login view.
 */
export const ProtectedRoute = ({ isAuthenticated, children, onRedirectLogin }) => {
  if (!isAuthenticated) {
    onRedirectLogin();
    return null;
  }
  return children;
};

export default ProtectedRoute;
