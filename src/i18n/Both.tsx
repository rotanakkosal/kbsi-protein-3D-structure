/**
 * Text that the server renders before the page language is known (the frame and the first
 * loading message): both versions are in the HTML and CSS shows the one matching <html lang>,
 * which the head script sets before first paint. Client-only UI uses useText instead.
 */
export function Both({ en, ko }: { en: string; ko: string }) {
  return (
    <>
      <span className="lang-en">{en}</span>
      <span className="lang-ko" lang="ko">
        {ko}
      </span>
    </>
  );
}
