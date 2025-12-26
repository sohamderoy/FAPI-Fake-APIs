export interface ProjectNameSectionProps {
  currentProjectName: string;
  projectNameError: string;
  hasProjectNameChanges: boolean;
  isSavingProjectName: boolean;
  onProjectNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveProjectName: () => void;
}
