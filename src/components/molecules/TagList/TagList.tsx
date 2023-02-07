import { useState } from "react";
import { Input, Tag } from "@atoms/index";

interface TagListProps {
  title?: string;
  error?: string;
  values: string[];
  editable?: boolean;
  onChange?(values: string[]): void;
  fixedWidth?: boolean;
  emptyTitle?: string;
  placeholder?: string;
  // onAdd(value: string): void;
  // onRemove?(value: string): void;
}

export default function TagList(props: TagListProps) {
  const [newValue, setNewValue] = useState("");

  function handleRemove(value: string) {
    props?.onChange(props.values.filter((v) => v !== value));
  }

  function handleAdd() {
    if (newValue === "") return;
    props?.onChange([...props.values, newValue]);
    setNewValue("");
  }

  return (
    <div className="tagList">
      {props.editable && <Input
        fixedWidth={props.fixedWidth}
        style={{ marginBottom: "0.65rem" }}
        title={props.title}
        error={props.error}
        value={newValue}
        setValue={setNewValue}
        onSubmit={handleAdd}
        placeholder={props.placeholder || "Add new tag"}
      />}
      {!props.editable && <h5 className="tagList__title">{props.title}</h5>}
      <div className="tagList__tags">
        {Array.isArray(props.values) &&
          props.values.map((value, index) => (
            <Tag key={index} closable={props.editable} onClose={handleRemove}>
              {value}
            </Tag>
          ))}
        {!Array.isArray(props.values) || props.values.length === 0 ? (
          <Tag disabled>{props.emptyTitle || "No tag items"}</Tag>
        ) : null}
      </div>
    </div>
  );
}
