export default function GreetingHeader({ name = "there" }) {
  const hour = new Date().getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? "Good morning,"
      : hour >= 12 && hour < 17
      ? "Good afternoon,"
      : "Good evening,";

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <p className="text-3xl font-headline italic text-foreground leading-tight">
          {greeting}
        </p>
        <p className="text-3xl font-headline italic leading-tight" style={{ color: "#FFB95F" }}>
          {name.split(" ")[0]}.
        </p>
      </div>
      <span className="font-mono text-sm text-outline pt-1">{dateStr}</span>
    </div>
  );
}
