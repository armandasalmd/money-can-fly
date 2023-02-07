import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { Button, Drawer, Select } from "@components/atoms";
import { TagList } from "@components/molecules";
import { importSettingsAtom } from "@recoil/imports/atoms";
import { categotyPreset } from "@utils/SelectItems";
import { Category } from "@utils/Types";
import { capitalise } from "@utils/Global";

interface ImportSettingsDrawerProps {
  open: boolean;
  onClose(): void;
}

export default function ImportSettingsDrawer(props: ImportSettingsDrawerProps) {
  const [changed, setChanged] = useState(false);
  const [state, setState] = useRecoilState(importSettingsAtom);
  const [category, setCategory] = useState<Category>("deposits");

  const saveButton = (
    <Button type={changed ? "primary" : "default"} disabled={!changed} onClick={onSave}>
      Save
    </Button>
  );

  function onIgnoreTermsChange(tags: string[]) {
    setState({
      ...state,
      ignoreTerms: tags,
    });
  }

  function onCategoryTermsChange(tags: string[]) {
    setState({
      ...state,
      categoryFallbacks: {
        ...state.categoryFallbacks,
        [category]: tags,
      },
    });
  }

  function onSave() {
    if (!changed) return;

    fetch("/api/imports/settings/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    })
      .then((res) => res.json())
      .then((data) => {
        setState(data);
      });
    setChanged(false);
  }

  function onChangeCallback(updateFn: (o: any) => void) {
    return (o: any) => {
      setChanged(true);
      updateFn(o);
    };
  }

  function handleClose() {
    props.onClose();
    setChanged(false);
    setCategory("deposits");
  }

  const definedCategoryFallbacks = Object.entries(state.categoryFallbacks)
    .filter((o) => Array.isArray(o[1]) && o[1].length > 0)
    .map((o) => (
      <div className="importSettings__tagGroup" key={o[0]}>
        <p className="importSettings__info">{capitalise(o[0])}</p>
        <TagList values={o[1]} />
      </div>
    ));

  useEffect(() => {
    async function fetchSettings() {
      await fetch("/api/imports/settings/read")
        .then((res) => res.json())
        .then((data) => {
          setState(data);
        });
    }
    // userUID === null indicates that section was not loaded yet
    // after loading, server will send valid userUID
    if (props.open && state.userUID === null) fetchSettings();
  }, [props.open, setState, state.userUID]);

  return (
    <Drawer
      title="Shared import settings"
      subtitle="Set file parsing options"
      open={props.open}
      onClose={handleClose}
      scrollable
      extra={saveButton}
    >
      <div className="importSettings">
        <div className="importSettings__section">
          <h3 className="importSettings__title">Import row skip</h3>
          <p className="importSettings__info">
            Specify what description terms should be ignored in the import. Terms doesn&apos;t have to be exact.
          </p>
          <div className="importSettings__main">
            <TagList
              title="Ignore terms"
              values={state.ignoreTerms}
              editable
              onChange={onChangeCallback(onIgnoreTermsChange)}
              emptyTitle="No ignore terms"
              placeholder="Enter a term"
            />
          </div>
        </div>
        <div className="importSettings__section">
          <h3 className="importSettings__title">Edit category fallback</h3>
          <p className="importSettings__info">
            Specify what description terms should be matched to a selected category.
          </p>
          <div className="importSettings__main">
            <Select
              items={categotyPreset}
              title="Category to edit"
              fixedWidth
              onChange={(val: Category) => setCategory(val)}
              value={category}
              required
            />
            {category && (
              <TagList
                title={`Linking terms for ${category}`}
                values={state.categoryFallbacks[category] || []}
                editable
                onChange={onChangeCallback(onCategoryTermsChange)}
                emptyTitle="No ignore terms"
                placeholder="Enter a term"
              />
            )}
          </div>
        </div>
        <div className="importSettings__section">
          <h3 className="importSettings__title">Defined category fallbacks</h3>
          {definedCategoryFallbacks}
          {definedCategoryFallbacks.length === 0 && (
            <p className="importSettings__info">No defined category fallbacks.</p>
          )}
        </div>
      </div>
    </Drawer>
  );
}
