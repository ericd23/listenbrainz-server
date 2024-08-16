import NiceModal, { useModal } from "@ebay/nice-modal-react";
import * as React from "react";
import { useState } from "react";

type SyndicationFeedModalProps = {
  feedTitle: string;
  options: {
    label: string;
    key: string;
    type: "dropdown" | "number";
    values: { id: string; value: string; displayValue?: string }[];
    defaultIndex?: number;
  }[];
  baseUrl: string;
};

type SelectedOptions = {
  [key: string]: string;
};

export default NiceModal.create((props: SyndicationFeedModalProps) => {
  const modal = useModal();
  const closeModal = React.useCallback(() => {
    modal.hide();
    document?.body?.classList?.remove("modal-open");
    setTimeout(modal.remove, 200);
  }, [modal]);

  const { feedTitle, options, baseUrl } = props;

  const initialSelectedOptions: SelectedOptions = options.reduce(
    (acc: SelectedOptions, option) => {
      const defaultIndex = option.defaultIndex ?? 0;
      acc[option.key] = option.values[defaultIndex].value;
      return acc;
    },
    {}
  );

  const [selectedOptions, setSelectedOptions] = React.useState<SelectedOptions>(
    initialSelectedOptions
  );

  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const handleOptionChange = (key: string, value: string) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [key]: value,
    }));
  };

  const buildLink = () => {
    const queryParams = new URLSearchParams(selectedOptions).toString();
    return `${baseUrl}?${queryParams}`;
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(buildLink()).then(() => {
      setCopyButtonText("Copied");

      setTimeout(() => {
        setCopyButtonText("Copy");
      }, 2000);
    });
  };

  return (
    <div
      id="SyndicationFeedModal"
      className={`modal fade ${modal.visible ? "in" : ""}`}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="syndicationFeedModalLabel"
      data-backdrop="static"
    >
      <div
        className="modal-dialog"
        role="document"
        style={{ maxWidth: "800px" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title" id="syndicationFeedModalLabel">
              Feed: {feedTitle}
            </h4>
          </div>

          <div className="modal-body">
            {options.map((option) => (
              <div className="form-group" key={option.key}>
                <label htmlFor={option.key}>{option.label}</label>
                {option.type === "dropdown" && (
                  <select
                    className="form-control"
                    id={option.key}
                    onChange={(e) =>
                      handleOptionChange(option.key, e.target.value)
                    }
                    defaultValue={selectedOptions[option.key]}
                  >
                    {option.values.map((value) => (
                      <option key={value.id} value={value.value}>
                        {value.displayValue || value.value}
                      </option>
                    ))}
                  </select>
                )}
                {option.type === "number" && (
                  <input
                    type="number"
                    className="form-control"
                    id={option.key}
                    value={selectedOptions[option.key]}
                    onChange={(e) =>
                      handleOptionChange(option.key, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
            <div className="form-group">
              <label htmlFor="feedLink">Subscription URL</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  className="form-control"
                  id="feedLink"
                  value={buildLink()}
                  readOnly
                  style={{ marginRight: "10px", flexGrow: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-info btn-sm"
                  onClick={handleCopyClick}
                  style={{ minWidth: "100px", height: "34px" }}
                >
                  {copyButtonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});