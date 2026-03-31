import TableRow from "./TableRow";
import EmptyState from "./EmptyState";

export default function LinksTable({ links, onDelete, onNewSnip }) {
  if (links.length === 0) {
    return <EmptyState onNewSnip={onNewSnip} />;
  }

  return (
    <div
      className="bg-surface-container-lowest rounded-xl overflow-hidden"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-outline-variant/20 bg-surface-container-low/50">
            <th className="py-3 pl-4 pr-3 text-left text-xs font-mono uppercase tracking-widest text-secondary">
              Short Link
            </th>
            <th className="py-3 px-3 text-left text-xs font-mono uppercase tracking-widest text-secondary">
              Destination
            </th>
            <th className="py-3 px-3 text-left text-xs font-mono uppercase tracking-widest text-secondary">
              Clicks
            </th>
            <th className="py-3 px-3 text-left text-xs font-mono uppercase tracking-widest text-secondary">
              Status
            </th>
            <th className="py-3 pl-3 pr-4 text-left text-xs font-mono uppercase tracking-widest text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <TableRow key={link._id} link={link} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
