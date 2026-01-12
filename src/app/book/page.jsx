"use client";

import { useEffect, useState } from "react";

export default function BookPage() {
  const [calendlyUrl, setCalendlyUrl] = useState(null);

  useEffect(() => {
    const storedUrl = sessionStorage.getItem("calendlyUrl");
    if (storedUrl) {
      setCalendlyUrl(storedUrl);

      // Redirect after a short delay so user can see the message
      const timer = setTimeout(() => {
        window.location.href = storedUrl;
      }, 1500); // 1.5 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  if (!calendlyUrl) {
    return (
      <div className="p-6 text-sm text-red-600">
        No Calendly URL found. Please go back to the calculator.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-white p-6 text-center">
      <h1 className="text-xl font-semibold mb-4">Opening Calendly...</h1>
      <p className="mb-4 text-gray-700">
        You will be redirected to Calendly in a new tab shortly.
      </p>
      <p className="text-gray-500 text-sm">
        If it doesn't open automatically, <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">click here</a>.
      </p>
    </div>
  );
}
