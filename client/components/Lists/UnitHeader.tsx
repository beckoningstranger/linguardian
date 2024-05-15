interface UnitHeaderProps {
  unitName?: string;
}

export default function UnitHeader({ unitName = "New Unit" }: UnitHeaderProps) {
  return <div>{unitName}</div>;
}
