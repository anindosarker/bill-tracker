import { format } from "date-fns";

interface BillHeaderProps {
  date?: Date;
}

export function BillHeader({ date = new Date() }: BillHeaderProps) {
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

      {/* Date */}
      <div className="mb-2 flex justify-end">
        <p className="text-sm" style={{ fontFamily: "Times New Roman" }}>
          {format(date, "dd/MM/yyyy")}
        </p>
      </div>
    </>
  );
}
