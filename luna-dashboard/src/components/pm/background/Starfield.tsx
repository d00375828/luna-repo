// components/pm/background/Starfield.tsx
// Animated-ish starfield using CSS gradients (fast, no canvas).
// Keeps the space vibe without heavy rendering.

export default function Starfield() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050615]" />
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.28),transparent_50%),radial-gradient(circle_at_50%_85%,rgba(99,102,241,0.20),transparent_55%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(1px_1px_at_140px_90px,white,transparent),radial-gradient(1px_1px_at_260px_220px,white,transparent),radial-gradient(2px_2px_at_380px_120px,white,transparent)] [background-size:420px_260px]" />
      <div className="absolute -inset-24 opacity-20 blur-3xl bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-indigo-600/20" />
    </div>
  );
}
