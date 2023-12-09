import { ShoppingForm } from "./ShopperMatch";
import { isWithinInterval } from "date-fns";

export const calculateMatchScore = (
  referenceCategory: string | null,
  // referenceQuantity: number | null,
  referenceLocation: string | null,
  referenceTimeStart: string | null,
  referenceTimeEnd: string | null,
  row: ShoppingForm
): number => {
  const categoryScore = referenceCategory === row.category ? 30 : 0;
  const quantityScore = (row.quantity / 10) * 20;
  const locationScore = referenceLocation === row.location ? 20 : 0;

  const parsedReferenceTimeStart = parseDate(referenceTimeStart);
  const parsedReferenceTimeEnd = parseDate(referenceTimeEnd);

  const isTimeOverlap =
    parsedReferenceTimeStart !== null &&
    parsedReferenceTimeEnd !== null &&
    isWithinInterval(row.timeStart, {
      start: parsedReferenceTimeStart,
      end: parsedReferenceTimeEnd,
    });

  const timeScore = isTimeOverlap ? 30 : 0;

  const totalScore = categoryScore + quantityScore + locationScore + timeScore;

  return totalScore;
};

function parseDate(dateString: string | null): Date | null {
  if (dateString !== null) {
    return new Date(dateString);
  }
  return null;
}
