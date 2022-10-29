import Image from "next/image";

export interface EmptyProps {
  text?: string;
}

export default function Empty(props: EmptyProps) {
  return (
    <div className="empty">
      <Image width={128} height={128} alt="no data" src="/images/no-data.svg" />
      <p className="empty__text">{props.text ? props.text : "Container is empty"}</p>
    </div>
  );
}
