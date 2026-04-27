import type { InputProps } from "../../types/internal";

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  textarea = false,
}: InputProps) => {
  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-gray-800">{label}</p>}

      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-32 p-4 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      )}
    </div>
  );
};

export default Input;
