'use client';

import { useState, InputHTMLAttributes, forwardRef } from 'react';

interface FloatFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const FloatField = forwardRef<HTMLInputElement, FloatFieldProps>(
  ({ label, id, className = '', ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      props.value !== undefined
        ? String(props.value).length > 0
        : String(props.defaultValue ?? '').length > 0,
    );

    const lifted = focused || hasValue;

    return (
      <div className="relative pb-1">
        <input
          ref={ref}
          id={id}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            props.onChange?.(e);
          }}
          className={[
            'peer w-full bg-transparent border-0 border-b pt-5 pb-1.5 outline-none',
            'font-body text-[15px] font-medium text-white caret-volt',
            'transition-colors duration-200',
            focused
              ? 'border-volt'
              : hasValue
                ? 'border-white/20'
                : 'border-white/10',
            className,
          ].join(' ')}
          style={{ borderBottomWidth: '1px', borderRadius: 0 }}
          {...props}
        />

        <label
          htmlFor={id}
          className={[
            'absolute left-0 pointer-events-none transition-all duration-200 origin-left',
            lifted
              ? 'top-0 text-[10px] tracking-[0.1em] uppercase font-display font-bold'
              : 'top-5 text-[15px] font-normal font-body',
            focused ? 'text-volt' : 'text-white/30',
          ].join(' ')}
        >
          {label}
        </label>

        {/* Sliding active bar */}
        <span
          className={[
            'absolute bottom-0 left-0 h-px bg-volt transition-all duration-250 ease-out',
            focused ? 'w-full' : 'w-0',
          ].join(' ')}
        />
      </div>
    );
  },
);

FloatField.displayName = 'FloatField';
export default FloatField;
