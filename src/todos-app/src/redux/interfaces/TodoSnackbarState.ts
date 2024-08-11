import { AlertSeverity } from '../enums/AlertSeverity'

export interface TodoSnackbarState {
    message: string;
    alertSeverity: AlertSeverity;
}