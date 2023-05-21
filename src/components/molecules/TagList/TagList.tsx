import { useState } from "react";
import classNames from "classnames";
import { Input, Tag, TagType } from "@atoms/index";

interface TagListProps {
  title?: string;
  error?: string;
  values: string[];
  editable?: boolean;
  onChange?(values: string[]): void;
  fixedWidth?: boolean;
  emptyTitle?: string;
  placeholder?: string;
  vertical?: boolean;
  type?: TagType;
}

export default function TagList(props: TagListProps) {
  const classes = classNames("tagList", {
    "tagList--vertical": props.vertical,
  });
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
    <div className={classes}>
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
            <Tag type={props.type} key={index} closable={props.editable} onClose={handleRemove}>
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
