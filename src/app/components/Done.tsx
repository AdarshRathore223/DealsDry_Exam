import React from "react";

function Done() {
  return (
    <div role="status" className="flex justify-center items-center">
      <svg
        className="w-8 h-8 animate-done"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="green"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="done-path" d="M4 12l5 5L20 6" fill="none" />
      </svg>

      <style>
        {`
        @keyframes draw {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 0;
          }
        }

        .done-path {
          stroke-dasharray: 0, 100;
          animation: draw 1s ease-out forwards;
        }
      `}
      </style>
    </div>
  );
}

export default Done;