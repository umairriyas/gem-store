import Footer from "@/app/components/footer";
import Link from "next/link";
import { Gem, ShieldCheck, Globe, Mail, MessageCircle } from "lucide-react";

export const metadata = {
  title: "About Us | Riyas Gems",
  description:
    "Learn about Riyas Gems, our story, our gemstone expertise, and our commitment to quality and trust.",
};

export default function AboutPage() {
  const whatsappNumber = "94771234567";
  const whatsappMessage =
    "Hi, I visited your About Us page and would like to know more about your gemstones.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  const emailAddress = "info@riyasgems.com";
  const emailSubject = "Inquiry from About Us page";
  const emailBody =
    "Hi,\n\nI would like to know more about your gemstones and services.\n\nThank you.";
  const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
    emailSubject,
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="bg-white text-gray-900">
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            About Riyas Gems
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Natural gemstones sourced with care, presented with trust.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            We are passionate about connecting gemstone buyers with beautiful,
            carefully selected stones while making the buying experience simple,
            transparent, and personal.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/gems"
              className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
            >
              Explore Gems
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Our story
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-600">
              Riyas Gems was built around a simple belief: buying gemstones
              should feel trustworthy, informative, and approachable. Instead of
              overwhelming customers with technical details alone, we aim to
              help each buyer understand the beauty, value, and uniqueness of
              every stone.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Whether someone is searching for a gemstone for personal
              collection, jewelry, gifting, or investment, our goal is to make
              that journey clearer through honest presentation, responsive
              support, and carefully curated selections.
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-8">
            <h3 className="text-xl font-semibold text-gray-900">
              What we stand for
            </h3>

            <div className="mt-6 space-y-5">
              <div className="flex gap-4">
                <Gem className="mt-1 h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Quality selection
                  </p>
                  <p className="text-sm leading-6 text-gray-600">
                    We focus on gemstones that are visually striking and worthy
                    of customer confidence.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <ShieldCheck className="mt-1 h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Trust and clarity
                  </p>
                  <p className="text-sm leading-6 text-gray-600">
                    We believe product information, pricing, and communication
                    should be straightforward and honest.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Globe className="mt-1 h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-gray-900">Global reach</p>
                  <p className="text-sm leading-6 text-gray-600">
                    We aim to serve gemstone enthusiasts and buyers from around
                    the world with a smooth online experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Why customers choose us
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-lg font-semibold text-gray-900">
                Curated gemstone collection
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Our collection is organized to help customers discover gemstones
                by type and interest without unnecessary confusion.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-lg font-semibold text-gray-900">
                Personal customer support
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                We make it easy to ask questions and get help before making a
                purchase.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-lg font-semibold text-gray-900">
                Built for trust online
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                From product pages to direct contact options, we want every step
                to feel reliable and transparent.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Let’s help you find the right gemstone
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Contact us for gemstone details, pricing information, or help
            choosing a stone that fits your needs.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={emailUrl}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
            >
              <Mail className="h-5 w-5" />
              Email Us
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
