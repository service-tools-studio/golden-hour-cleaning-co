import HomeHeader from "@/components/HomeHeader";
import HomePageSections from "@/components/home/HomePageSections";
import SegmentButton from "@/components/SegmentButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fffbea]">
      <HomeHeader />

      <section
        aria-labelledby="home-hero-heading"
        className="mx-auto max-w-5xl px-6 py-14 sm:py-20"
      >
        <div className="max-w-2xl">
          <h1
            id="home-hero-heading"
            className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl"
          >
            Professional Cleaning Services for Homes &amp; Businesses in Portland
          </h1>

          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            Whether you need recurring cleaning, a deep clean, move-out cleaning, or
            commercial services, Golden Hour Cleaning Co. makes it easy to receive an
            instant quote and book online.
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
      </section>

      <HomePageSections />
    </main>
  );
}
