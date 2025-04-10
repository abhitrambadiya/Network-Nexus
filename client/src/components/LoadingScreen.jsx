// components/LoadingScreen.jsx
const LoadingScreen = ({ message = "Loading..." }) => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">{message}</p>
        </div>
      </div>
    );
  };
  
  export default LoadingScreen;
  