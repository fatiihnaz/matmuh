import Hero from "./components/Hero";

export default function Landing({ highlights = [] }) {
  return (
    <div className="relative">
      <Hero highlights={highlights} />
    </div>
  );
}
