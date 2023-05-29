import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import getDataOrAriaProps from '../_util/getDataOrAriaProps';
import { RadioGroupContextProvider } from './Context';
import Radio from './Radio';
import type { RadioChangeEvent, RadioGroupProps } from './interface';

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
  const [value, setValue] = useMergedState(props.defaultValue, {
    value: props.value,
  });

  const onRadioChange = (ev: RadioChangeEvent) => {
    const lastValue = value;
    const val = ev.target.value;
    if (!('value' in props)) {
      setValue(val);
    }
    const { onChange } = props;
    if (onChange && val !== lastValue) {
      onChange(ev);
    }
  };

  const {
    className,
    options,
    disabled,
    children,
    style,
    id,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
  } = props;

  let childrenToRender = children;
  // 如果存在 options, 优先使用
  if (options && options.length > 0) {
    childrenToRender = options.map((option) => {
      if (typeof option === 'string' || typeof option === 'number') {
        // 此处类型自动推导为 string
        return (
          <Radio
            key={option.toString()}
            disabled={disabled}
            value={option}
            checked={value === option}
          >
            {option}
          </Radio>
        );
      }
      // 此处类型自动推导为 { label: string value: string }
      return (
        <Radio
          key={`radio-group-value-options-${option.value}`}
          disabled={option.disabled || disabled}
          value={option.value}
          checked={value === option.value}
          style={option.style}
          className={option.className}
        >
          {option.label}
        </Radio>
      );
    });
  }

  const classString = clsx('inline-flex flex-wrap gap-x-2', className);

  return (
    <div
      {...getDataOrAriaProps(props)}
      className={classString}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      id={id}
      ref={ref}
    >
      <RadioGroupContextProvider
        value={{
          onChange: onRadioChange,
          value,
          disabled: props.disabled,
          name: props.name,
        }}
      >
        {childrenToRender}
      </RadioGroupContextProvider>
    </div>
  );
});

export default React.memo(RadioGroup);
