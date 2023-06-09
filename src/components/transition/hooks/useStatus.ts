import usePrevious from 'meta-ui/es/_util/hooks/usePrevious';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { MutableRefObject, useState } from 'react';
import useIsMounted from '../../_util/hooks/useIsMounted';
import useLatestValue from '../../_util/hooks/useLatestValue';
import { once } from '../../_util/once';
import { TransitionStatus, TransitionStyleType } from '../interface';
import disposables from '../util/disposables';
import {
  addClasses,
  addStyles,
  removeClasses,
  removeStyles,
  waitForTransition,
} from '../util/style';
import { useDisposables } from './useDisposables';

interface StatusArgs {
  container: MutableRefObject<HTMLElement | null>;
  skip: boolean;
  visible: boolean;
  styles: MutableRefObject<{
    enter: TransitionStyleType;
    enterFrom: TransitionStyleType;
    enterTo: TransitionStyleType;
    leave: TransitionStyleType;
    leaveFrom: TransitionStyleType;
    leaveTo: TransitionStyleType;
    entered: TransitionStyleType;
  }>;
  onStart: () => void;
  onStop: () => void;
}

function transition(
  node: HTMLElement,
  styles: {
    enter: TransitionStyleType;
    enterFrom: TransitionStyleType;
    enterTo: TransitionStyleType;
    leave: TransitionStyleType;
    leaveFrom: TransitionStyleType;
    leaveTo: TransitionStyleType;
    entered: TransitionStyleType;
  },
  status: TransitionStatus.Enter | TransitionStatus.Leave,
  done?: () => void,
) {
  let d = disposables();
  let _done = done !== undefined ? once(done) : () => {};

  if (status === TransitionStatus.Enter) {
    node.removeAttribute('hidden');
    node.style.display = '';
  }

  const baseCls = styles[status].className;
  const toCls = styles[`${status}To`].className;
  const fromCls = styles[`${status}From`].className;

  const baseStyle = styles[status].style;
  const toStyle = styles[`${status}To`].style;
  const fromStyle = styles[`${status}From`].style;

  removeClasses(
    node,
    ...styles.enter.className,
    ...styles.enterTo.className,
    ...styles.enterFrom.className,
    ...styles.leave.className,
    ...styles.leaveTo.className,
    ...styles.leaveFrom.className,
    ...styles.entered.className,
  );
  removeStyles(node, {
    ...styles.enter.style,
    ...styles.enterTo.style,
    ...styles.enterFrom.style,
    ...styles.leave.style,
    ...styles.leaveFrom.style,
    ...styles.leaveTo.style,
    ...styles.entered.style,
  });

  addClasses(node, ...baseCls, ...fromCls);
  addStyles(node, { ...baseStyle, ...fromStyle });

  d.nextFrame(() => {
    removeClasses(node, ...fromCls);
    removeStyles(node, fromStyle);
    addClasses(node, ...toCls);
    addStyles(node, toStyle);

    waitForTransition(node, () => {
      removeClasses(node, ...baseCls);
      removeStyles(node, baseStyle);
      addClasses(node, ...styles.entered.className);
      addStyles(node, styles.entered.style);

      return _done();
    });
  });

  return d.dispose;
}

export default function useStatus({
  container,
  skip,
  visible,
  styles,
  onStart,
  onStop,
}: StatusArgs) {
  const mounted = useIsMounted();

  const [status, setStatus] = useState(TransitionStatus.None);

  const d = useDisposables();

  const onStartRef = useLatestValue(onStart);
  const onStopRef = useLatestValue(onStop);

  const prevVisible = usePrevious(visible);
  useLayoutEffect(() => {
    setStatus(() => {
      if (skip) return TransitionStatus.None;
      if (prevVisible === visible) return TransitionStatus.None;
      return visible ? TransitionStatus.Enter : TransitionStatus.Leave;
    });
  }, [skip, visible]);

  useLayoutEffect(() => {
    const dd = disposables();
    d.add(dd.dispose);

    const node = container.current;
    if (!node) return; // We don't have a DOM node (yet)
    if (status === TransitionStatus.None) return; // We don't need to transition
    if (!mounted.current) return;

    dd.dispose();

    onStartRef.current();

    dd.add(
      transition(node, styles.current, status, () => {
        dd.dispose();
        setStatus(TransitionStatus.None);
        onStopRef.current();
      }),
    );

    return dd.dispose;
  }, [status]);

  return [status];
}
