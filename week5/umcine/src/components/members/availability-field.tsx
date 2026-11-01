import { useState, type SubmitEvent } from "react";
import type { CheckResponse } from "../../types/member";
import { cn } from "../../utils/cn";

interface AvailabilityFieldProps {
  label: string;
  type: "text" | "email";
  placeholder: string;
  check: (value: string) => Promise<CheckResponse>;
}

interface CheckMessage {
  text: string;
  isError: boolean;
}

export function AvailabilityField({
  label,
  type,
  placeholder,
  check,
}: AvailabilityFieldProps) {
  const [value, setValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState<CheckMessage | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsChecking(true);

    try {
      const { available } = await check(value.trim());
      setMessage({
        text: available
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
        isError: !available,
      });
    } catch {
      setMessage({ text: "중복 확인에 실패했어요.", isError: true });
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="text-sm font-semibold text-gray-900">
        {label}
        <div className="mt-2 flex gap-2">
          <input
            required
            type={type}
            value={value}
            disabled={isChecking}
            placeholder={placeholder}
            onChange={(event) => {
              setValue(event.target.value);
              setMessage(null);
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-normal"
          />
          <button
            type="submit"
            disabled={isChecking}
            className="flex-shrink-0 cursor-pointer rounded-md border-none bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-gray-400"
          >
            중복 확인
          </button>
        </div>
      </label>
      {message && (
        <p
          className={cn(
            "mt-2 text-sm",
            message.isError ? "text-red-600" : "text-blue-600"
          )}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
