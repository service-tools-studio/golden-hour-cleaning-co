import type { Metadata } from "next";
import CalendarDetailsClient from "./CalendarDetailsClient";

export const metadata: Metadata = {
  title: "Calendar details | Golden Hour Cleaning Co.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InternalCalendarDetailsPage() {
  return <CalendarDetailsClient />;
}
