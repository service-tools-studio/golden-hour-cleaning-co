"use client";

import { useEffect } from "react";

export default function BookPage() {
  useEffect(() => {
    const storedUrl = sessionStorage.getItem("calendlyUrl");

    if (storedUrl) {
      // Redirect the browser
      window.location.href = storedUrl;
    } else {
      // Optional: show a message if no URL found
      alert("No Calendly URL found. Go back to the calculator first.");
    }
  }, []);

  return (
    <div className="p-6 text-sm text-gray-700">
      Redirecting to Calendly...
    </div>
  );
}
