export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface EndpointValidationResult extends ValidationResult {
  invalidKey?: string;
}
