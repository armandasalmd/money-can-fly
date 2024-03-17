import { useState, useEffect } from "react";
import { Bank, CurrencyGbp, CurrencyDollar, CurrencyEur, Coin, Article, Tag, BracketsAngle, ArchiveTray, ClockAfternoon } from "phosphor-react";

import { Button, Checkbox, Card, Message, Select, Input } from "@atoms/index";
import importPresets, { ImportFormState, ImportPreset } from "./ImportPresets";
import { capitalise, toCheckState } from "@utils/Global";
import { bankNamesPreset, currencyPreset } from "@utils/SelectItems";
import { SelectItem } from "@utils/SelectItems";
import { ImportCsvReader } from "@utils/CsvReader";
import { usePreferences } from "@context/index";

const currencyIcons = {
  gbp: CurrencyGbp,
  eur: CurrencyEur,
  usd: CurrencyDollar,
};

export interface ImportConfigFormProps {
  onStartImport: (formState: ImportFormState) => void;
  importFile: File | null;
  onClose: () => void;
}

export default function ImportConfigForm(props: ImportConfigFormProps) {
  const { defaultCurrency } = usePreferences();
  const [error, setError] = useState("");
  const [csvColumnsSelect, setCsvColumnsSelect] = useState<SelectItem[]>([]);
  const [formState, setFormState] = useState<ImportFormState>({
    ...importPresets.custom.formState,
    defaultCurrency
  });

  function onPresetClick(preset: ImportPreset) {
    if (preset.type !== "custom") {
      setFormState(preset.formState);
    } else {
      setFormState({
        ...preset.formState,
        defaultCurrency,
      });
    }
  }

  function onInputChange(value: string | boolean, name: string) {
    if (name) {
      setFormState({ ...formState, [name]: value });
    }
  }

  const presetButtons = Object.values(importPresets).map((preset, index) => (
    <Button key={index} type="easy" wrapContent onClick={() => onPresetClick(preset)}>
      {capitalise(preset.type)}
    </Button>
  ));

  function onSubmit() {
    if (validateForm()) {
      props.onStartImport(formState);
    } else {
      setError("Please fill in all required fields.");
    }
  }

  function validateForm() {
    const {
      bank,
      defaultCurrency,
      transactionDateColumn,
      descriptionColumn,
      amountColumn,
      currencyColumn,
      transactionFeeColumn,
    } = formState;
    return (
      bank &&
      defaultCurrency &&
      transactionDateColumn &&
      descriptionColumn &&
      amountColumn &&
      (!formState.hasCurrencyColumn || currencyColumn) &&
      (!formState.hasTransactionFeeColumn || transactionFeeColumn)
    );
  }

  useEffect(() => {
    setError("");
    setFormState({
      ...importPresets.custom.formState,
      defaultCurrency
    });

    if (props.importFile) {
      const importCsvReader = new ImportCsvReader();

      importCsvReader
        .readHeaderSelectItems(props.importFile)
        .then(setCsvColumnsSelect)
        .catch((error: Error) => {
          setError(error.message);
        });
    }
  }, [props.importFile, defaultCurrency]);

  if (!props.importFile) {
    return null;
  }

  return (
    <Card
      className="importConfig"
      noContentPaddingX
      noContentPaddingY
      noDivider
      header={{
        title: "Step 2. Choose file configuration",
        description: "Using file " + props.importFile.name,
        color: "primary",
      }}
      headerActions={[
        {
          text: "Close",
          onClick: props.onClose,
          type: "transparent",
        },
      ]}
    >
      <div className="importConfig__body">
        <div className="importConfig__presets">
          <h3 className="importConfig__presetsTitle">Presets</h3>
          <div className="importConfig__presetsList">{presetButtons}</div>
        </div>
        {error && (
          <Message colorType="error" messageStyle="bordered" onDismiss={() => setError("")}>
            {error}
          </Message>
        )}
        <div className="importConfig__form">
          <section>
            <p className="importConfig__sectionTitle">Import settings</p>
            <div className="importConfig__sectionInputs">
              <Select
                items={bankNamesPreset}
                name="bank"
                icon={Bank}
                required
                title="Bank name"
                value={formState.bank}
                onChange={onInputChange}
              />
              <Select
                items={currencyPreset}
                name="defaultCurrency"
                icon={currencyIcons[formState.defaultCurrency]}
                required
                title="Default currency"
                value={formState.defaultCurrency}
                onChange={onInputChange}
              />
              <Input
                title="Ignore where description contains"
                placeholder="ATM withdraw..."
                icon={BracketsAngle}
                name="ignoreDescriptionPattern"
                value={formState.ignoreDescriptionPattern}
                onChange={onInputChange}
              />
              <Input
                title="Date format"
                placeholder="Automatic parse"
                icon={ClockAfternoon}
                name="dateFormat"
                value={formState.dateFormat}
                onChange={onInputChange}
              />
              <Checkbox
                name="alterBalance"
                title="Alter balance value"
                onChange={onInputChange}
                value={toCheckState(formState.alterBalance)}
              />
            </div>
          </section>
          <section>
            <p className="importConfig__sectionTitle">Column mappings</p>
            <div className="importConfig__options">
              <Checkbox
                horizontal
                name="hasCategoryColumn"
                title="Has category column"
                onChange={onInputChange}
                value={toCheckState(formState.hasCategoryColumn)}
              />
              <Checkbox
                horizontal
                name="hasCurrencyColumn"
                title="Has currency column"
                onChange={onInputChange}
                value={toCheckState(formState.hasCurrencyColumn)}
              />
              <Checkbox
                horizontal
                name="hasTransactionFeeColumn"
                title="Has transaction fee column"
                onChange={onInputChange}
                value={toCheckState(formState.hasTransactionFeeColumn)}
              />
            </div>
            <div className="importConfig__sectionInputs">
              <Select
                menuAbove
                items={csvColumnsSelect}
                name="transactionDateColumn"
                icon={Bank}
                required
                title="Transaction date column"
                value={formState.transactionDateColumn}
                onChange={onInputChange}
              />
              <Select
                menuAbove
                items={csvColumnsSelect}
                name="descriptionColumn"
                icon={Article}
                required
                title="Description column"
                value={formState.descriptionColumn}
                onChange={onInputChange}
              />
              <Select
                menuAbove
                items={csvColumnsSelect}
                name="amountColumn"
                icon={Coin}
                required
                title="Amount column"
                value={formState.amountColumn}
                onChange={onInputChange}
              />
              <Select
                menuAbove
                items={csvColumnsSelect}
                name="currencyColumn"
                disabled={!formState.hasCurrencyColumn}
                icon={currencyIcons["gbp"]}
                required={formState.hasCurrencyColumn}
                title="Currency column"
                value={formState.currencyColumn}
                onChange={onInputChange}
              />
              <Select
                menuAbove
                items={csvColumnsSelect}
                name="transactionFeeColumn"
                disabled={!formState.hasTransactionFeeColumn}
                icon={Tag}
                required={formState.hasTransactionFeeColumn}
                title="Transaction fee column"
                value={formState.transactionFeeColumn}
                onChange={onInputChange}
              />
              <Select
                menuAbove
                items={csvColumnsSelect}
                name="categoryColumn"
                disabled={!formState.hasCategoryColumn}
                icon={ArchiveTray}
                required={formState.hasCategoryColumn}
                title="Category column"
                value={formState.categoryColumn}
                onChange={onInputChange}
              />
            </div>
          </section>
          <section>
            <Button wrapContent type="primary" onClick={onSubmit}>
              Start import process
            </Button>
          </section>
        </div>
      </div>
    </Card>
  );
}
