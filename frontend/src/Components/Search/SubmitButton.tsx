import React from "react";
import Spinner from "../Generic/Spinner";

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
    >
      {isLoading && <Spinner />}
      <span>{isLoading ? "Searching..." : "Search"}</span>
    </button>
  );
}

export default SubmitButton