import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import * as React from 'react';

import type { SizeType } from '../config-provider/SizeContext';

export interface SpaceCompactItemContextType {
  compactSize?: SizeType;
  compactDirection?: 'horizontal' | 'vertical';
  isFirstItem?: boolean;
  isLastItem?: boolean;
}

export const SpaceCompactItemContext = React.createContext<SpaceCompactItemContextType | null>(
  null,
);

export const useCompactItemContext = () => {
  const compactItemContext = React.useContext(SpaceCompactItemContext);

  const compactItemClassnames = React.useMemo(() => {
    if (!compactItemContext) return '';

    const { compactDirection, isFirstItem, isLastItem } = compactItemContext;
    const separator = compactDirection === 'vertical' ? '-vertical-' : '-';

    return classNames({
      [`compact${separator}item`]: true,
      [`compact${separator}first-item`]: isFirstItem,
      [`compact${separator}last-item`]: isLastItem,
    });
  }, [compactItemContext]);

  return {
    compactSize: compactItemContext?.compactSize,
    compactDirection: compactItemContext?.compactDirection,
    compactItemClassnames,
  };
};

export const NoCompactStyle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <SpaceCompactItemContext.Provider value={null}>{children}</SpaceCompactItemContext.Provider>
);

export interface SpaceCompactProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SizeType;
  direction?: 'horizontal' | 'vertical';
  block?: boolean;
}

const CompactItem: React.FC<React.PropsWithChildren<SpaceCompactItemContextType>> = ({
  children,
  ...otherProps
}) => (
  <SpaceCompactItemContext.Provider value={otherProps}>{children}</SpaceCompactItemContext.Provider>
);

const Compact: React.FC<SpaceCompactProps> = (props) => {
  const { size = 'middle', direction, block, className, children, ...restProps } = props;

  const clx = classNames(
    {
      'flex w-full': block,
      'flex-col': direction === 'vertical',
    },
    'inline-flex',
    className,
  );

  const compactItemContext = React.useContext(SpaceCompactItemContext);

  const childNodes = toArray(children);
  const nodes = React.useMemo(
    () =>
      childNodes.map((child, i) => {
        const key = (child && child.key) || `item-${i}`;

        return (
          <CompactItem
            key={key}
            compactSize={size}
            compactDirection={direction}
            isFirstItem={i === 0 && (!compactItemContext || compactItemContext?.isFirstItem)}
            isLastItem={
              i === childNodes.length - 1 && (!compactItemContext || compactItemContext?.isLastItem)
            }
          >
            {child}
          </CompactItem>
        );
      }),
    [size, childNodes, compactItemContext],
  );

  // =========================== Render ===========================
  if (childNodes.length === 0) {
    return null;
  }

  return (
    <div className={clx} {...restProps}>
      {nodes}
    </div>
  );
};

export default Compact;
