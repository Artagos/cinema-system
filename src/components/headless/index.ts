/**
 * Headless Components Index
 * 
 * Export all headless UI components and hooks.
 * 
 * Usage:
 * import { DataGrid, DataGridWithChildren, useDataGrid } from './components/headless';
 */

export { DataGrid, DataGridWithChildren, useDataGrid } from './DataGrid';
export type { DataGridState, DataGridRenderProps, DataGridChildrenProps } from './DataGrid';

export { Modal, useModal } from './Modal';
export type { ModalRenderProps, ModalProps, UseModalResult } from './Modal';
