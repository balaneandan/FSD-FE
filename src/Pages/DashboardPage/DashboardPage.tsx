import { Stack } from "@fluentui/react";
import { useContext } from "react";
import { AuthenticationContext } from "../../App";
import { IClient } from "../../Models/IClient";

export const DashboardPage = ():JSX.Element => {
    const authenticationService = useContext(AuthenticationContext);
    let client: IClient = authenticationService.getUser();
    return (
        <Stack>
            This is dashboard page for user :  
            {/* {authenticationService.getUser()} */}
            {client.name}
            {client.admin && <div>Admin</div>}
        </Stack>
    );
}