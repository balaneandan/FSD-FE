export interface ICustomTextField {
    textFieldLabel: string;
    textContent: string;
    textDisabled?: boolean;
    errorMessage: string;
    saveButton?: (event: any) => void;
    sectionChanged: (event: any) => void;
}