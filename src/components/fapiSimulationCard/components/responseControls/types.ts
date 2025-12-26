export interface ResponseControlsProps {
  currentResponseCode: number;
  currentResponseDelay: number;
  onResponseCodeChange: (code: number) => void;
  onResponseDelayChange: (delay: number) => void;
}
