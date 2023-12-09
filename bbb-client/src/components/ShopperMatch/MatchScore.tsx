import { ShoppingForm } from "./ShopperMatch";
import { isWithinInterval } from "date-fns";

export const calculateMatchScore = (
  reference: ShoppingForm,
  row: ShoppingForm
): number => {
  const categoryScore = reference.category === row.category ? 30 : 0;
  const quantityScore = (row.quantity / 10) * 20;
  const locationScore = reference.location === row.location ? 20 : 0;

  const isTimeOverlap = isWithinInterval(row.timeStart, {
    start: reference.timeStart,
    end: reference.timeEnd,
  });
  const timeScore = isTimeOverlap ? 30 : 0;

  const totalScore =
    (categoryScore + quantityScore + locationScore + timeScore) * 10;

  return totalScore;
};
