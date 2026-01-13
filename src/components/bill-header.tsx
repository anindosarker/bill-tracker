import { format, parse } from "date-fns";

interface BillHeaderProps {
  date?: Date;
  billDate?: string; // YYYY-MM-DD format
  duration?: string; // "DD.MM.YYYY to DD.MM.YYYY" format
}

export function BillHeader({ date, billDate, duration }: BillHeaderProps) {
  // Parse billDate from YYYY-MM-DD format or use provided date
  const displayDate = billDate
    ? (() => {
        try {
          const [year, month, day] = billDate.split("-");
          return parse(`${day}/${month}/${year}`, "d/M/yyyy", new Date());
        } catch {
          return date || new Date();
        }
      })()
    : date || new Date();

  return (
    <>
      {/* Header */}
      <div className="text-center">
        <h1
          className="mb-2 text-2xl font-bold"
          style={{ fontFamily: "Times New Roman" }}
        >
          INDEPENDENT AGRISCIENCE FACTORY
        </h1>
        <h2
          className="mb-1 text-lg font-semibold"
          style={{ fontFamily: "Times New Roman" }}
        >
          RANIRHAT, SAHJAHANPUR, BOGURA
        </h2>
        <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
          (WORKER WAGES Payment Sheet)
        </p>
      </div>

      {/* Duration and Bill Date */}
      <div className="mb-2 flex items-center justify-between">
        {duration && (
          <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
            Duration {duration}
          </p>
        )}
        <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
          {format(displayDate, "dd/M/yyyy")}
        </p>
      </div>
    </>
  );
}
