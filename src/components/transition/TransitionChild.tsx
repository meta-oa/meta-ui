import React, { ForwardRefRenderFunction, forwardRef, useContext } from 'react';
import Transition from './Transition';
import TransitionItem, { TransitionItemProps } from './TransitionItem';
import { OpenClosedContext, TransitionContext } from './context';

export type TransitionChildProps = TransitionItemProps & {
  show?: boolean;
  appear?: boolean;
};

const InternalTransitionChild: ForwardRefRenderFunction<HTMLElement, TransitionChildProps> = (
  props,
  ref,
) => {
  let hasTransitionContext = useContext(TransitionContext) !== null;
  let hasOpenClosedContext = useContext(OpenClosedContext) !== null;

  return (
    <>
      {!hasTransitionContext && hasOpenClosedContext ? (
        <Transition ref={ref} {...props} />
      ) : (
        <TransitionItem ref={ref} {...props} />
      )}
    </>
  );
};

const TransitionChild = forwardRef<HTMLElement, TransitionItemProps>(InternalTransitionChild);

if (process.env.NODE_ENV !== 'production') {
  TransitionChild.displayName = 'TransitionChild';
}

export default TransitionChild;