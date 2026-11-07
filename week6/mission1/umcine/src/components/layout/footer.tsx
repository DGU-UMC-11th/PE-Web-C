export function Footer() {
  return (
    <footer className="shrink-0 border-t border-[#dfe2e7] bg-white py-5">
      <div className="mx-auto flex w-[calc(100%_-_32px)] max-w-[1280px] items-center justify-end gap-2 text-[11px] text-[#656a73] min-[701px]:w-[calc(100%_-_160px)]">
        <span aria-label="TMDB" className="font-black tracking-tight text-cyan-500">TMDB</span>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </div>
    </footer>
  );
}
