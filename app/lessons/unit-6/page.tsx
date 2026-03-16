import UnitLesson from "@/components/lessons/UnitLesson";
import { UNITS } from "@/data/curriculum";

export default function UnitPage() {
  const unit = UNITS.find((u) => u.number === 6)!;
  return <UnitLesson unit={6} title={unit.title} subtitle={unit.subtitle} />;
}
