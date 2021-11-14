import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import { config } from './Axios/UseAxios';
import { Clients } from './Components/Clients/Clients';
import { IClient } from './Models/IClient';
import { SwipeableTemporaryDrawer } from './Pages/AppBar/AppBar';
import { ChartsPage } from './Pages/ChartsPage/ChartsPage';
import { ClientsPage } from './Pages/ClientsPage/ClientsPage';
import { DashboardPage } from './Pages/DashboardPage/DashboardPage';
import { DeniedAccessPage } from './Pages/DeniedAccess/DeniedAccess';
import { DevicesPage } from './Pages/DevicesPage/DevicesPage';
import { HomePage } from './Pages/HomePage/HomePage';
import { LoginPage } from './Pages/LoginPage/LoginPage';
import { SensorsPage } from './Pages/SensorsPage/SensorsPage';
import { ClientsService } from './Utils';





export const AuthenticationContext = createContext(null);

export const UserMenu = () => {
    const history = useHistory();
    const authenticationService = useContext(AuthenticationContext);
  	const handleHomeClick = () => history.push("/");
    const handleLogoutClick = () => authenticationService.logoutUser();
    const handleAdminClick = () => history.push("/admin");
    return (
      <>
      <button onClick={handleHomeClick}>Home</button>
      {authenticationService.getUser() !== undefined && 
        <div>
          <button onClick={handleLogoutClick}>Logout </button>
          <button onClick={handleAdminClick}>Admin </button>
          <button onClick={() => history.push("/dashboard")}>Dashboard </button>
          </div>
        }

      </>
    );
};

const App = () => {
  const history = useHistory();
  const [user, setUser] = useState<IClient>(undefined);


  const authenticationService = {
      getUserName: () => user?.name,
      getUser: () => user,
      loginUser: (userr: any) => {
          //TODO: Replace setUser with AJAX request to server
          axios(config(ClientsService.LOGIN_CLIENT,'POST', userr))
          .then((response) => {
            setUser(response.data);
            history.push("/dashboard")
          
          })
          .catch((_) => {
          });

          
          return true;
      },
      logoutUser: () => {
          //TODO: Replace setUser with AJAX request to server
          setUser(undefined);
          history.push("/");
          return true;
      }
      // other methods ...
  };
  return (
    <AuthenticationContext.Provider value={authenticationService}>
      <SwipeableTemporaryDrawer/>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        {user !== undefined ? 
        <>
          <Route exact path="/dashboard" component={DashboardPage} />
          <Route exact path="/clients" component={ClientsPage} />
          <Route exact path="/charts" component={ChartsPage} />
          <Route exact path="/devices" component={DevicesPage} />
          <Route exact path="/sensors" component={SensorsPage} />
        </>
        :
        <>
          <DeniedAccessPage/>
        </>
        }
        {user?.isAdmin === true ? <Route exact path="/admin" component={Clients} /> : <div>Denied</div>}
        
      </Switch>
    </AuthenticationContext.Provider>
  );
};

export default App;