import type * as React from 'react';

// ========================= Options =========================
interface ItemSharedProps {
  style?: React.CSSProperties;
  className?: string;
}

export interface SubMenuType<T extends MenuItemType = MenuItemType> extends ItemSharedProps {
  label?: React.ReactNode;
  children: ItemType<T>[];
  disabled?: boolean;
  key: string;
  className?: string;
  icon?: React.ReactNode;
  theme?: 'dark' | 'light';

  // >>>>> Icon
  expandIcon?: RenderIconType;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

  // >>>>> Popup
  popupClassName?: string;
  popupOffset?: number[];
  popupStyle?: React.CSSProperties;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onTitleClick?: (info: MenuTitleInfo) => void;
  onTitleMouseEnter?: MenuHoverEventHandler;
  onTitleMouseLeave?: MenuHoverEventHandler;
}

export interface MenuItemType extends ItemSharedProps {
  label?: React.ReactNode;
  disabled?: boolean;
  itemIcon?: RenderIconType;
  key: React.Key;
  danger?: boolean;
  icon?: React.ReactNode;
  title?: string;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
}

export interface MenuItemGroupType<T extends MenuItemType = MenuItemType> extends ItemSharedProps {
  type: 'group';
  label?: React.ReactNode;
  children?: ItemType<T>[];
  key?: React.Key;
}

export interface MenuDividerType extends ItemSharedProps {
  type: 'divider';
  dashed?: boolean;
  key?: React.Key;
}

export type ItemType<T extends MenuItemType = MenuItemType> =
  | T
  | SubMenuType<T>
  | MenuItemGroupType<T>
  | MenuDividerType
  | null;

// ========================== Basic ==========================
export type MenuMode = 'horizontal' | 'vertical' | 'inline';

export type BuiltinPlacements = Record<string, any>;

export type TriggerSubMenuAction = 'click' | 'hover';

export interface RenderIconInfo {
  isSelected?: boolean;
  isOpen?: boolean;
  isSubMenu?: boolean;
  disabled?: boolean;
}

export type RenderIconType = React.ReactNode | ((props: RenderIconInfo) => React.ReactNode);

export interface MenuInfo {
  key: string;
  keyPath: string[];
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export interface MenuTitleInfo {
  key: string;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

// ========================== Hover ==========================
export type MenuHoverEventHandler = (info: {
  key: string;
  domEvent: React.MouseEvent<HTMLElement>;
}) => void;

// ======================== Selection ========================
export interface SelectInfo extends MenuInfo {
  selectedKeys: string[];
}

export type SelectEventHandler = (info: SelectInfo) => void;

// ========================== Click ==========================
export type MenuClickEventHandler = (info: MenuInfo) => void;

export type MenuRef = {
  /**
   * Focus active child if any, or the first child which is not disabled will be focused.
   * @param options
   */
  focus: (options?: FocusOptions) => void;
  list: HTMLUListElement;
};
