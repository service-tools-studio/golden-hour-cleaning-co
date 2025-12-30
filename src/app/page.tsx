import SegmentButton from "@/components/SegmentButton";
import Header from "../components/shared/Header";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Header />
      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
        <div className="max-w-2xl">


          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Choose your{" "}
            <span className="relative inline-block">
              service type
              <span className="pointer-events-none absolute -bottom-1 left-0 h-[7px] w-full rounded-full bg-brand/55" />
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Select Residential or Commercial to see services, pricing guidance, and
            request a quote.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <SegmentButton
            href="/residential"
            title="Residential"
            description="Homes, apartments, move-in/out, recurring cleanings."
          />
          <SegmentButton
            href="/commercial"
            title="Commercial"
            description="Offices, studios, retail spaces, recurring janitorial."
          />
        </div>

        <div className="mt-14 h-px w-full bg-brand/35" />
        <footer className="mt-6 text-xs text-stone-500">
          Serving the Portland metro area • Eco-minded products • High-touch service
        </footer>
      </div>
    </main>
  );
}
