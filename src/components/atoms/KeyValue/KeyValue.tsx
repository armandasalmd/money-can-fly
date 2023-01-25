interface KeyValueProps {
  title: string;
  value: string;
}

export default function KeyValue(props: KeyValueProps) {
  return (
    <div className="keyValue">
      <div className="keyValue__title">{props.title}</div>
      <div className="keyValue__value">{props.value}</div>
    </div>
  );
}