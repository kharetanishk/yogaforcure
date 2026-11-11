import { HOME_FAQ } from "@/lib/site";

// The homepage FAQPage structured data reads the same HOME_FAQ list, so what
// people see and what search engines read always match.
export default function HomeFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative w-full bg-[#f5f1eb] py-16 sm:py-20 lg:py-28 scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2
          id="faq-heading"
          className="text-center text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1a3a1a] mb-10 sm:mb-12"
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {HOME_FAQ.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-[#ddd5c8] bg-[#faf8f5] shadow-sm open:shadow-md transition-shadow"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-base sm:text-lg font-semibold text-[#1a3a1a] [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl leading-none text-[#6b8e5a] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base leading-relaxed text-[#2d2d2d]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
