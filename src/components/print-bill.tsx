"use client";

import { IBill } from "@/backend/models/bill.model";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { format } from "date-fns";

interface PrintBillProps {
  bill: IBill;
}

export function PrintBill({ bill }: PrintBillProps) {
  const handlePrint = () => {
    window.print();
  };

  // Convert number to words (simple implementation)
  const numberToWords = (num: number): string => {
    const ones = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    const tens = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];
    const teens = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];

    if (num === 0) return "zero";
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? " " + ones[num % 10] : "")
      );
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        " hundred" +
        (num % 100 !== 0 ? " " + numberToWords(num % 100) : "")
      );
    if (num < 100000)
      return (
        numberToWords(Math.floor(num / 1000)) +
        " thousand" +
        (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "")
      );
    if (num < 10000000)
      return (
        numberToWords(Math.floor(num / 100000)) +
        " lakh" +
        (num % 100000 !== 0 ? " " + numberToWords(num % 100000) : "")
      );
    return (
      numberToWords(Math.floor(num / 10000000)) +
      " crore" +
      (num % 10000000 !== 0 ? " " + numberToWords(num % 10000000) : "")
    );
  };

  const amountInWords = numberToWords(Math.floor(bill.totalTk));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-end print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <div className="bg-white p-8 print:p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            INDEPENDENT AGRISCIENCE FACTORY
          </h1>
          <h2 className="text-lg font-semibold mb-1">
            RANIRHAT, SAHJAHANPUR, BOGURA
          </h2>
          <p className="text-sm">(WORKER WAGES Payment Sheet)</p>
        </div>

        <div className="mb-6">
          <p className="text-center text-sm mb-4">
            Date: {format(new Date(bill.createdAt), "dd/MM/yyyy")}
          </p>
        </div>

        <table className="w-full border-collapse border border-black mb-6">
          <thead>
            <tr>
              <th className="border border-black p-2 text-left">Worker Name</th>
              <th className="border border-black p-2 text-center">
                Working Hour
              </th>
              <th className="border border-black p-2 text-center">
                Wages per Hour (Tk)
              </th>
              <th className="border border-black p-2 text-center">
                Over time (Hour)
              </th>
              <th className="border border-black p-2 text-center">
                Over time per Hour (Tk)
              </th>
              <th className="border border-black p-2 text-center">
                Payment status
              </th>
              <th className="border border-black p-2 text-center">Total tk.</th>
              <th className="border border-black p-2 text-center">Signature</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">{bill.workerName}</td>
              <td className="border border-black p-2 text-center">
                {bill.workingHours}
              </td>
              <td className="border border-black p-2 text-center">
                {bill.wagePerHour}
              </td>
              <td className="border border-black p-2 text-center">
                {bill.overtimeHours}
              </td>
              <td className="border border-black p-2 text-center">
                {bill.overtimeWagePerHour}
              </td>
              <td className="border border-black p-2 text-center">
                {bill.paymentStatus}
              </td>
              <td className="border border-black p-2 text-center">
                {bill.totalTk.toLocaleString("en-BD")}
              </td>
              <td className="border border-black p-2 min-h-[60px]">
                {bill.signature || ""}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mb-4">
          <p className="text-sm">
            <strong>In Words:</strong> {amountInWords} taka only
          </p>
        </div>

        <div className="mt-8 flex justify-between text-sm">
          <div>
            <p>Prepared by</p>
          </div>
          <div className="text-right">
            <p>For, Independent Agriscience Factory</p>
            <p className="mt-4">Bogura</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          nav,
          header,
          footer {
            display: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
