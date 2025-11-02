import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! The page you're looking for doesn't exist.</p>
        <div className="flex flex-col gap-4">
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
          <p className="text-sm text-gray-500">
            You were looking for: <code className="bg-gray-200 p-1 rounded">{location.pathname}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;