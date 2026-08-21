import {
  CUSTOM_BUDGET_OPTION,
  formatCustomBudgetAmount,
  isCustomBudget,
  isValidCustomBudgetAmount,
} from "@/lib/project-inquiry";

type BudgetChoiceGroupProps = {
  title: string;
  name: string;
  options: readonly string[];
  value: string;
  customAmount: string;
  onSelect: (value: string) => void;
  onCustomAmountChange: (value: string) => void;
};

export function BudgetChoiceGroup({
  title,
  name,
  options,
  value,
  customAmount,
  onSelect,
  onCustomAmountChange,
}: BudgetChoiceGroupProps) {
  const choiceOptions = [...options, CUSTOM_BUDGET_OPTION];
  const showCustomInput = isCustomBudget(value);
  const formattedAmount = customAmount ? formatCustomBudgetAmount(customAmount) : "";

  return (
    <fieldset className="inquiryChoices">
      <legend>{title}</legend>
      <div>
        {choiceOptions.map((option, index) => {
          const isWide = option === CUSTOM_BUDGET_OPTION;

          return (
            <label
              className={`inquiryChoice${isWide ? " inquiryBudgetChoiceWide" : ""}`}
              key={option}
            >
              <input
                data-inquiry-autofocus={index === 0 ? true : undefined}
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={() => onSelect(option)}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
      {showCustomInput ? (
        <div className="inquiryCustomBudget">
          <label htmlFor={`${name}-amount`}>Your budget amount</label>
          <div className="inquiryCustomBudgetField">
            <span aria-hidden="true">₱</span>
            <input
              id={`${name}-amount`}
              data-inquiry-autofocus
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={customAmount}
              onChange={(event) => onCustomAmountChange(event.target.value.replace(/\D/g, ""))}
              placeholder="500000"
              aria-describedby={`${name}-amount-hint`}
            />
          </div>
          <p id={`${name}-amount-hint`} className="inquiryCustomBudgetHint">
            {formattedAmount && isValidCustomBudgetAmount(customAmount)
              ? `We'll note your budget as ${formattedAmount}.`
              : "Enter the amount in Philippine pesos (minimum ₱1,000)."}
          </p>
        </div>
      ) : null}
    </fieldset>
  );
}
