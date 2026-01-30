export function HeroBanner() {
  return (
    <section className="rounded-2xl border bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-800 p-6 text-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">
            Dev Mode
          </p>
          <h2 className="text-2xl font-semibold">
            Sketch layouts now, wire data later.
          </h2>
          <p className="mt-1 max-w-xl text-sm text-indigo-100">
            This environment is locked to mock data so we can focus on layout,
            navigation, and the mind map without worrying about Supabase auth
            yet.
          </p>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">
            Next step
          </p>
          <p>Map repos → Supabase tables</p>
        </div>
      </div>
    </section>
  );
}
