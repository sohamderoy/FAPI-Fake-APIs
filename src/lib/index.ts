// Barrel export for all library components
// This file provides a single entry point for importing UI components

// Components
export { default as AnimatedBackground } from "./animatedBackground";
export { default as AppName } from "./appName";
export { default as Badge } from "./badge";
export { default as Button } from "./button";
export { default as Card } from "./card";
export { default as ConfirmationModal } from "./confirmationModal";
export { default as CopyButton } from "./copyButton";
export { default as Editor } from "./editor";
export { default as LoadingOverlay } from "./loadingOverlay";
export { default as Modal } from "./modal";
export { default as PrivacyBanner } from "./privacyBanner";
export { default as Snackbar } from "./snackbar";

// Types
export type { AppNameProps } from "./appName/types";
export type { BadgeProps } from "./badge/types";
export type { ButtonProps } from "./button/types";
export type { CardProps } from "./card/types";
export type { ConfirmationModalProps, ConfirmationButton } from "./confirmationModal/types";
export type { CopyButtonProps } from "./copyButton/types";
export type { EditorProps } from "./editor/types";
export type { LoadingOverlayProps } from "./loadingOverlay/types";
export type { ModalProps } from "./modal/types";
export type { SnackbarProps } from "./snackbar/types";

// Data/Constants (if needed externally)
export { BADGE_COLORS } from "./badge/data";
export { CARD_SIZES } from "./card/data";
export { MODAL_SIZES, BASE_STYLE } from "./modal/data";
