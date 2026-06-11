export type TabId = 'hero' | 'diagnostico' | 'validacion' | 'contenido';

export interface TabState {
  activeTab: TabId;
  previousTab: TabId | null;
}

const TAB_ORDER: readonly TabId[] = ['hero', 'diagnostico', 'validacion', 'contenido'] as const;

const VALID_TAB_IDS: ReadonlySet<string> = new Set(TAB_ORDER);

/**
 * Switch from one tab to another, returning the new state.
 */
export function switchTab(current: TabId, target: TabId): TabState {
  return {
    activeTab: target,
    previousTab: current,
  };
}

/**
 * Get the next or previous tab in order, wrapping cyclically.
 */
export function getNextTab(current: TabId, direction: 'next' | 'prev'): TabId {
  const currentIndex = TAB_ORDER.indexOf(current);
  const offset = direction === 'next' ? 1 : -1;
  const nextIndex = (currentIndex + offset + TAB_ORDER.length) % TAB_ORDER.length;
  return TAB_ORDER[nextIndex];
}

/**
 * Type guard that validates whether a string is a valid TabId.
 */
export function isValidTabId(id: string): id is TabId {
  return VALID_TAB_IDS.has(id);
}

export { TAB_ORDER };
