import classNames from 'classnames';
import RcTooltip from 'rc-tooltip';
import type {
  TooltipProps as RcTooltipProps,
  TooltipRef as RcTooltipRef,
} from 'rc-tooltip/lib/Tooltip';
import type { placements as Placements } from 'rc-tooltip/lib/placements';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { CSSProperties } from 'react';
import * as React from 'react';
import type { AdjustOverflow, PlacementsConfig } from '../_util/placements';
import getPlacements from '../_util/placements';
import { cloneElement, isFragment, isValidElement } from '../_util/reactNode';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import { NoCompactStyle } from '../space/Compact';
import type { BuildInPlacements } from '../trigger';
import { parseColor } from './util';

export type { AdjustOverflow, PlacementsConfig };

export interface TooltipRef {
  forceAlign: VoidFunction;
}

export type TooltipPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

export interface TooltipAlignConfig {
  points?: [string, string];
  offset?: [number | string, number | string];
  targetOffset?: [number | string, number | string];
  overflow?: { adjustX: boolean; adjustY: boolean };
  useCssRight?: boolean;
  useCssBottom?: boolean;
  useCssTransform?: boolean;
}
// remove this after RcTooltip switch visible to open.
interface LegacyTooltipProps
  extends Partial<
    Omit<
      RcTooltipProps,
      | 'children'
      | 'visible'
      | 'defaultVisible'
      | 'onVisibleChange'
      | 'afterVisibleChange'
      | 'destroyTooltipOnHide'
    >
  > {
  open?: RcTooltipProps['visible'];
  defaultOpen?: RcTooltipProps['defaultVisible'];
  onOpenChange?: RcTooltipProps['onVisibleChange'];
  afterOpenChange?: RcTooltipProps['afterVisibleChange'];
}

export interface AbstractTooltipProps extends LegacyTooltipProps {
  style?: React.CSSProperties;
  className?: string;
  rootClassName?: string;
  color?: string;
  placement?: TooltipPlacement;
  builtinPlacements?: typeof Placements;
  openClassName?: string;
  arrow?:
    | boolean
    | {
        pointAtCenter?: boolean;
      };
  autoAdjustOverflow?: boolean | AdjustOverflow;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  children?: React.ReactNode;
  destroyTooltipOnHide?: boolean | { keepParent?: boolean };
}

export type RenderFunction = () => React.ReactNode;

export interface TooltipPropsWithOverlay extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction;
  overlay?: React.ReactNode | RenderFunction;
}

export interface TooltipPropsWithTitle extends AbstractTooltipProps {
  title: React.ReactNode | RenderFunction;
  overlay?: React.ReactNode | RenderFunction;
}

export declare type TooltipProps = TooltipPropsWithTitle | TooltipPropsWithOverlay;

const splitObject = <T extends CSSProperties>(
  obj: T,
  keys: (keyof T)[],
): Record<'picked' | 'omitted', T> => {
  const picked: T = {} as T;
  const omitted: T = { ...obj };
  keys.forEach((key) => {
    if (obj && key in obj) {
      picked[key] = obj[key];
      delete omitted[key];
    }
  });
  return { picked, omitted };
};

// Fix Tooltip won't hide at disabled button
// mouse events don't trigger at disabled button in Chrome
function getDisabledCompatibleChildren(element: React.ReactElement<any>, prefixCls: string) {
  const elementType = element.type as any;
  if (
    ((elementType.__META_BUTTON === true || element.type === 'button') && element.props.disabled) ||
    (elementType.__META_SWITCH === true && (element.props.disabled || element.props.loading)) ||
    (elementType.__META_RADIO === true && element.props.disabled)
  ) {
    // Pick some layout related style properties up to span
    const { picked, omitted } = splitObject(element.props.style, [
      'position',
      'left',
      'right',
      'top',
      'bottom',
      'float',
      'display',
      'zIndex',
    ]);
    const spanStyle: React.CSSProperties = {
      display: 'inline-block', // default inline-block is important
      ...picked,
      cursor: 'not-allowed',
      width: element.props.block ? '100%' : undefined,
    };
    const buttonStyle: React.CSSProperties = {
      ...omitted,
      pointerEvents: 'none',
    };
    const child = cloneElement(element, {
      style: buttonStyle,
      className: null,
    });
    return (
      <span
        style={spanStyle}
        className={classNames(element.props.className, `${prefixCls}-disabled-compatible-wrapper`)}
      >
        {child}
      </span>
    );
  }
  return element;
}

const Tooltip = React.forwardRef<TooltipRef, TooltipProps>((props, ref) => {
  const {
    openClassName,
    getTooltipContainer,
    overlayClassName,
    color,
    overlayInnerStyle,
    children,
    afterOpenChange,
    afterVisibleChange,
    destroyTooltipOnHide,
    arrow = true,
    title,
    overlay,
    builtinPlacements,
    arrowPointAtCenter = false,
    autoAdjustOverflow = true,
  } = props;

  const mergedShowArrow = !!arrow;

  const { getPopupContainer: getContextPopupContainer } = React.useContext(ConfigContext);

  // ============================== Ref ===============================
  const tooltipRef = React.useRef<RcTooltipRef>(null);

  const forceAlign = () => {
    tooltipRef.current?.forceAlign();
  };

  React.useImperativeHandle(ref, () => ({
    forceAlign,
    forcePopupAlign: () => {
      warning(false, 'Tooltip', '`forcePopupAlign` is align to `forceAlign` instead.');
      forceAlign();
    },
  }));

  // ============================== Warn ==============================
  if (process.env.NODE_ENV !== 'production') {
    warning(
      !destroyTooltipOnHide || typeof destroyTooltipOnHide === 'boolean',
      'Tooltip',
      '`destroyTooltipOnHide` no need config `keepParent` anymore. Please use `boolean` value directly.',
    );
  }

  // ============================== Open ==============================
  const [open, setOpen] = useMergedState(false, {
    value: props.open ?? props.visible,
    defaultValue: props.defaultOpen ?? props.defaultVisible,
  });

  const noTitle = !title && !overlay && title !== 0; // overlay for old version compatibility

  const onOpenChange = (vis: boolean) => {
    setOpen(noTitle ? false : vis);
    if (!noTitle) {
      props.onOpenChange?.(vis);
      props.onVisibleChange?.(vis);
    }
  };

  const tooltipPlacements = React.useMemo<BuildInPlacements>(() => {
    let mergedArrowPointAtCenter = arrowPointAtCenter;
    if (typeof arrow === 'object') {
      mergedArrowPointAtCenter =
        arrow.pointAtCenter ?? arrow.arrowPointAtCenter ?? arrowPointAtCenter;
    }
    return (
      builtinPlacements ||
      getPlacements({
        arrowPointAtCenter: mergedArrowPointAtCenter,
        autoAdjustOverflow,
        arrowWidth: mergedShowArrow ? token.sizePopupArrow : 0,
        borderRadius: token.borderRadius,
        offset: token.marginXXS,
        visibleFirst: true,
      })
    );
  }, [arrowPointAtCenter, arrow, builtinPlacements, token]);

  const memoOverlay = React.useMemo<TooltipProps['overlay']>(() => {
    if (title === 0) {
      return title;
    }
    return overlay || title || '';
  }, [overlay, title]);

  const memoOverlayWrapper = (
    <NoCompactStyle>
      {typeof memoOverlay === 'function' ? memoOverlay() : memoOverlay}
    </NoCompactStyle>
  );

  const {
    getPopupContainer,
    placement = 'top',
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    overlayStyle,
    rootClassName,
    ...otherProps
  } = props;

  const prefixCls = getPrefixCls('tooltip');
  const rootPrefixCls = getPrefixCls();

  const injectFromPopover = (props as any)['data-popover-inject'];

  let tempOpen = open;
  // Hide tooltip when there is no title
  if (!('open' in props) && !('visible' in props) && noTitle) {
    tempOpen = false;
  }

  // ============================= Render =============================
  const child = getDisabledCompatibleChildren(
    isValidElement(children) && !isFragment(children) ? children : <span>{children}</span>,
    prefixCls,
  );
  const childProps = child.props;
  const childCls =
    !childProps.className || typeof childProps.className === 'string'
      ? classNames(childProps.className, {
          [openClassName || `${prefixCls}-open`]: true,
        })
      : childProps.className;

  // Color
  const colorInfo = parseColor(color);
  const formattedOverlayInnerStyle = { ...overlayInnerStyle, ...colorInfo.overlayStyle };
  const arrowContentStyle = colorInfo.arrowStyle;

  const customOverlayClassName = classNames(overlayClassName, {}, rootClassName);

  return (
    <RcTooltip
      {...otherProps}
      showArrow={mergedShowArrow}
      placement={placement}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      prefixCls={prefixCls}
      overlayClassName={customOverlayClassName}
      overlayStyle={{ ...arrowContentStyle, ...overlayStyle }}
      getTooltipContainer={getPopupContainer || getTooltipContainer || getContextPopupContainer}
      ref={tooltipRef}
      builtinPlacements={tooltipPlacements}
      overlay={memoOverlayWrapper}
      visible={tempOpen}
      onVisibleChange={onOpenChange}
      afterVisibleChange={afterOpenChange ?? afterVisibleChange}
      overlayInnerStyle={formattedOverlayInnerStyle}
      arrowContent={<span className={`${prefixCls}-arrow-content`} />}
      motion={{
        motionName: getTransitionName(rootPrefixCls, 'zoom-big-fast', props.transitionName),
        motionDeadline: 1000,
      }}
      destroyTooltipOnHide={!!destroyTooltipOnHide}
    >
      {tempOpen ? cloneElement(child, { className: childCls }) : child}
    </RcTooltip>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Tooltip.displayName = 'Tooltip';
}

export default Tooltip;
