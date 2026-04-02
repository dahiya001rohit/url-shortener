export default function PageHeader({ label, heading, subtext }) {
  return (
    <div className="mb-0">
      <p className="font-mono text-xs uppercase tracking-widest text-outline">
        {label}
      </p>
      <h1 className="font-headline italic text-5xl text-primary mt-1">
        {heading}
      </h1>
      {subtext && (
        <p className="text-sm font-body text-secondary mt-1">{subtext}</p>
      )}
    </div>
  );
}
