/**
 * Permanent redirects for blog URLs that no longer exist.
 * To add one, add a line below. It takes effect on the next deploy.
 * Always point `to` at the final URL, so a visitor never goes through two jumps.
 */
export type BlogRedirect = { from: string; to: string };

export const blogRedirects: BlogRedirect[] = [
  {
    from: "yoga-for-lower-back-pain-from-sitting-all-day-1790950839250",
    to: "yoga-for-lower-back-pain-from-sitting-all-day",
  },
  {
    from: "yoga-for-new-mothers-gentle-postnatal-recovery-1784523336683",
    to: "postnatal-yoga-india-sutkeri-recovery",
  },
  {
    from: "yoga-for-irregular-periods-practices-to-regulate-your-cycle-1792408611438",
    to: "yoga-for-irregular-periods-practices-to-regulate-your-cycle",
  },
  {
    from: "yoga-for-pcod-how-gentle-practice-restores-hormonal-balance-1791705950894",
    to: "yoga-for-pcod-how-gentle-practice-restores-hormonal-balance",
  },
  {
    from: "yoga-for-pcod-how-gentle-consistent-practice-helps-restore-hormonal-balance",
    to: "yoga-for-pcod-how-gentle-practice-restores-hormonal-balance",
  },
  {
    from: "the-best-online-yoga-classes-are-not-what-you-think-they-are-before-you-subscribe-to-a-yoga-platform-or-follow-another-youtube-routine-read-this-honest-guide-from-someone-who-has-taught-yoga-online-for-over-10-years",
    to: "best-online-yoga-classes-honest-guide",
  },
];
