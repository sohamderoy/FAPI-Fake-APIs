export interface CardActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onEditResponse: () => void;
  onUpdateFapi: () => void;
  onDeleteClick: () => void;
}
