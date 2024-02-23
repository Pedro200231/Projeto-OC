export interface Logs {
  id: number;
  action: string;
  targetEmail: string;
  timestamp: Date;
  beforeData: string;
  afterData: string;
}
