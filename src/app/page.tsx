import SegmentButton from "@/components/SegmentButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-stone-600">
            Golden Hour Cleaning Co.
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Choose your service type
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Select Residential or Commercial to see services, pricing guidance, and
            request a quote.
          </p>
        </header>

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

        <footer className="mt-14 text-xs text-stone-500">
          Serving the Portland metro area • Eco-minded products • High-touch service
        </footer>
      </div>
    </main>
  );
}
