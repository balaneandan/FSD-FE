import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import { Box, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SensorsIcon from '@mui/icons-material/Sensors';
import DevicesIcon from '@mui/icons-material/Devices';
import { useHistory } from 'react-router';
import { AuthenticationContext } from '../../App';
import { useContext } from 'react';
import { IClient } from '../../Models/IClient';
type Anchor = 'top' | 'left' | 'bottom' | 'right';

export const  SwipeableTemporaryDrawer = () => {
  const history = useHistory();
  const authenticationService = useContext(AuthenticationContext);
  let client: IClient = authenticationService.getUser();
  const handleDashboardClick = () => history.push("/dashboard");
  const handleClientsClick = () => history.push("/clients");
  const handleChartsClick = () => history.push("/charts");
  const handleDevicesClick = () => history.push("/devices");
  const handleSensorsClick = () => history.push("/sensors");

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

    const anchor = "left";
  return (
    <div>
      
        {authenticationService.getUser() === undefined ? 
        <Button onClick={() => history.push("/login")}>Login</Button>
        :
        <>
        <Button onClick={() => authenticationService.logoutUser()}>Log out</Button>
        <React.Fragment key={anchor}>
          
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            <Box>
                <ListItem button onClick={handleDashboardClick} >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>

                {client.admin && 
                  <>
                  <ListItem button onClick={handleClientsClick}>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Clients" />
                  </ListItem>
                  <ListItem button onClick={handleChartsClick}>
                    <ListItemIcon>
                      <BarChartIcon />
                    </ListItemIcon>
                  <ListItemText primary="Charts" />
                  </ListItem>
                  <ListItem button onClick={handleDevicesClick}>
                    <ListItemIcon>
                      <DevicesIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Devices" />
                  </ListItem>
                  <ListItem button onClick={handleSensorsClick}>
                    <ListItemIcon>
                      <SensorsIcon />
                    </ListItemIcon>
                  <ListItemText primary="Sensors" />
                </ListItem>
                  
                  </>}
                  
            </Box>
          </SwipeableDrawer>
        </React.Fragment>
        </>
        } 
    </div>
  );
}
