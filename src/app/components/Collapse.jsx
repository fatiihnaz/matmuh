export default function Collapse({ open, children }) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden" aria-hidden={!open}>
        {children}
      </div>
    </div>
  );
}
