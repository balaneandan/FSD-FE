import { Stack, StackItem, TextField } from "@fluentui/react";
import { ICustomTextField } from "./CustomTextField.types";


export const CustomTextField = (props:ICustomTextField) => {
    return (
        <Stack>
            <StackItem align={"start"}>
                {props.textFieldLabel}
            </StackItem>
            <StackItem  >
                <TextField
                    onChange={props.sectionChanged}
                    value={props.textContent}
                    disabled={false}
                    errorMessage={props.errorMessage}
                 />
            </StackItem>
        </Stack>
    );
}