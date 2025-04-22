import React, { useState, FormEvent, ChangeEvent } from 'react';

interface ChatInputProps {
  className?: string;
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  autoFocus?: boolean;
  onSubmit?: (e: FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  className,
  onSendMessage,
  placeholder = "Send a message...",
  disabled = false,
  value: controlledValue,
  onChange: controlledOnChange,
  maxLength,
  autoFocus = false,
  onSubmit: controlledOnSubmit,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (isControlled) {
      controlledOnChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      if (controlledOnSubmit) {
        controlledOnSubmit(e);
      } else {
        onSendMessage(value);
        if (!isControlled) {
          setInternalValue('');
        }
      }
    }
  };

  return (
    <div className={`border-t border-gray-200 p-4 bg-white ${className || ''}`}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              autoFocus={autoFocus}
              className="w-full resize-none rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0 p-3 pr-12 max-h-36 overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '44px' }}
            />
            <button
              type="submit"
              className="absolute right-2 bottom-2 p-1 rounded-lg text-gray-500 hover:text-gray-700 disabled:opacity-40"
              disabled={!value.trim() || disabled}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput; 