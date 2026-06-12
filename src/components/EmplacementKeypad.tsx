type EmplacementKeypadProps = {
  value: string;
  formattedValue: string | null;
  onPress: (digit: string) => void;
  onClear: () => void;
};

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function EmplacementKeypad({
  value,
  formattedValue,
  onPress,
  onClear,
}: EmplacementKeypadProps) {
  return (
    <div className="emplacement-layout">
      <div className={`location-display ${value && !formattedValue ? "invalid" : ""}`}>
        {formattedValue ?? "000"}
      </div>
      <div className="keypad" aria-label="Clavier emplacement">
        {digits.map((digit) => (
          <button key={digit} onClick={() => onPress(digit)}>
            {digit}
          </button>
        ))}
        <button className="zero" onClick={() => onPress("0")}>
          0
        </button>
        <button className="clear" onClick={onClear}>
          Effacer
        </button>
      </div>
    </div>
  );
}
