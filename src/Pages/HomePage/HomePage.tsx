import { Stack, StackItem } from "@fluentui/react";
import React from "react";
import { HomePageContaninerClass } from "./HomePage.styles";

export const HomePage = () => {
      return (
        <Stack className={HomePageContaninerClass}>
            <StackItem>
            </StackItem>
            <StackItem>
                This is home page.
            </StackItem>
        </Stack>
    );
}