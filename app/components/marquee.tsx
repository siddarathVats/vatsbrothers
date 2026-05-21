type Props = {
  items: string[];
  durationSec?: number;
};

export function Marquee({ items, durationSec = 50 }: Props) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee" style={{ ["--dur" as never]: `${durationSec}s` }}>
      <div className="marquee__track">
        {doubled.map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
