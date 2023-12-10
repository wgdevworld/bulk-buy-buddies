import { ShoppingForm } from "./ShopperMatch";
import { isWithinInterval } from "date-fns";

// Calculates the percentage match of two different requests
export const calculateMatchScore = (
  referenceCategory: string | null,
  referenceLocation: number | null,
  referenceTimeStart: string | null,
  referenceTimeEnd: string | null,
  row: ShoppingForm
): number => {
  const categoryScore = referenceCategory === row.category ? 40 : 15;
  // const quantityScore = (row.quantity / 10) * 20;
  const locationScore = referenceLocation === row.location ? 30 : 10;

  const parsedReferenceTimeStart = parseDate(referenceTimeStart);
  const parsedReferenceTimeEnd = parseDate(referenceTimeEnd);

  const isTimeOverlap =
    parsedReferenceTimeStart !== null &&
    parsedReferenceTimeEnd !== null &&
    isWithinInterval(row.timeStart, {
      start: parsedReferenceTimeStart,
      end: parsedReferenceTimeEnd,
    });

  const timeScore = isTimeOverlap ? 30 : 20;

  const totalScore = categoryScore + locationScore + timeScore;

  return totalScore;
};

// Parses date string in to Date() object
function parseDate(dateString: string | null): Date | null {
  if (dateString !== null) {
    return new Date(dateString);
  }
  return null;
}
