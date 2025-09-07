type StatItemProps = {
  number: string;
  label: string;
  description: string;
};

export function StatItem({ number, label, description }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-main mb-2">
        {number}
      </div>
      <div className="text-xl font-semibold text-white mb-2">{label}</div>
      <div className="text-foreground">{description}</div>
    </div>
  );
}
