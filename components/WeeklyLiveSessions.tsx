import { CLASS_TIMES, CLASS_TIMES_TEXT, WEEKLY_SESSIONS } from "@/lib/site";

// Same list feeds the Course structured data (lib/schema.ts).
const sessions = WEEKLY_SESSIONS.map((s) => ({ day: s.day, what: s.focus }));
const times = CLASS_TIMES.map((t) => `${t.label} (IST)`);

function Times({ className }: { className: string }) {
  return (
    <span className={`flex flex-col ${className}`}>
      {times.map((time) => (
        <span key={time}>{time}</span>
      ))}
    </span>
  );
}

export default function WeeklyLiveSessions() {
  return (
    <section
      id="weekly-live-sessions"
      className="relative w-full bg-[#1a3a1a] py-16 sm:py-20 md:py-24 lg:py-32 scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <header className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#faf8f5] mb-4">
            Weekly Live Schedule
          </h2>
        </header>

        {/* Mobile: card layout */}
        <div className="space-y-3 lg:hidden">
          {sessions.map((session, index) => (
            <div
              key={session.day}
              className="bg-[#faf8f5] rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md border border-[#ede8e0]/80 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-base sm:text-lg font-semibold text-[#1a3a1a]">
                  {session.day}
                </span>
                <Times className="text-sm sm:text-base text-[#6b8e5a] font-medium text-right" />
              </div>
              <p className="text-[#2d2d2d] text-sm sm:text-base">
                {session.what}
              </p>
            </div>
          ))}
        </div>

        {/* Large: big table */}
        <div className="hidden lg:block overflow-hidden rounded-2xl xl:rounded-3xl border border-[#9caf88]/30 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2d5a2d]/90 text-[#faf8f5]">
                <th className="px-6 xl:px-8 py-5 xl:py-6 text-base xl:text-lg font-semibold uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 xl:px-8 py-5 xl:py-6 text-base xl:text-lg font-semibold uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 xl:px-8 py-5 xl:py-6 text-base xl:text-lg font-semibold uppercase tracking-wider">
                  What we do
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#faf8f5]">
              {sessions.map((session, index) => (
                <tr
                  key={session.day}
                  className={`border-t border-[#ede8e0] ${
                    index % 2 === 1 ? "bg-[#f5f1eb]/80" : ""
                  }`}
                >
                  <td className="px-6 xl:px-8 py-5 xl:py-6 text-lg xl:text-xl font-medium text-[#1a3a1a]">
                    {session.day}
                  </td>
                  <td className="px-6 xl:px-8 py-5 xl:py-6 text-lg xl:text-xl text-[#2d2d2d]">
                    <Times className="gap-1" />
                  </td>
                  <td className="px-6 xl:px-8 py-5 xl:py-6 text-lg xl:text-xl text-[#2d2d2d]">
                    {session.what}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="sr-only">
          Weekly live online yoga classes in English. Monday: Strength & Power
          Yoga. Wednesday: Flexibility & Balance Yoga. Friday: Core Activation
          & Flow. Two batches each day: {CLASS_TIMES_TEXT}.
        </p>
      </div>
    </section>
  );
}
