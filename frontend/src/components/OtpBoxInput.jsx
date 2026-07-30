import React, { useRef } from 'react';

export const OtpBoxInput = ({ value = '', onChange, disabled = false, error = false }) => {
  const inputRefs = useRef([]);

  // Ensure value is formatted as a 6-digit string array
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  const handleInputChange = (index, e) => {
    const rawVal = e.target.value;
    const numOnly = rawVal.replace(/[^0-9]/g, '');

    if (!numOnly) {
      const newDigits = [...digits];
      newDigits[index] = '';
      onChange(newDigits.join(''));
      return;
    }

    const digit = numOnly.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    const nextValue = newDigits.join('');
    onChange(nextValue);

    // Auto-advance focus to next input box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous box if current is empty
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowRight') {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = Array.from({ length: 6 }, (_, i) => pastedData[i] || '');
    onChange(newDigits.join(''));

    // Focus box after last pasted digit
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-4">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleInputChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-black font-mono rounded-2xl bg-black/90 border transition-all duration-200 focus:outline-none ${
            error
              ? 'border-red-500/80 text-red-400 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : digit
              ? 'border-[#D4AF37] text-[#F5D76E] shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-zinc-900'
              : 'border-white/15 text-white focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:border-white/30'
          }`}
        />
      ))}
    </div>
  );
};
