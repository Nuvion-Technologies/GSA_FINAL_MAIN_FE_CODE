import React from 'react';
import { Loader2 } from 'lucide-react';
// Replace `cn` with a utility function if needed or remove it
import { cn } from './utils'; // Adjust the path if necessary

const LoadingButton = ({ loading, children, className, ...props }) => {
  return (
    <button
      className={cn(
        "relative",
        loading ? "cursor-not-allowed opacity-70" : "",
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && (
        <Loader2 className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin" />
      )}
      <span className={loading ? "invisible" : ""}>{children}</span>
    </button>
  );
};

export default LoadingButton;
