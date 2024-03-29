import * as React from 'react';

export const IdContext = React.createContext<string | undefined>(undefined);

export function getMenuId(uuid?: string, eventKey?: string) {
  if (uuid === undefined) {
    return null;
  }
  return `${uuid}-${eventKey}`;
}

/**
 * Get `data-menu-id`
 */
export function useMenuId(eventKey: string) {
  const id = React.useContext(IdContext);
  return getMenuId(id, eventKey);
}
