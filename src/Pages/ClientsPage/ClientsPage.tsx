import { DetailsListLayoutMode, IColumn, IObjectWithKey, Selection, SelectionMode, ShimmeredDetailsList, Stack, StackItem } from "@fluentui/react";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { config, IAxiosResult, UseAxios } from "../../Axios/UseAxios";
import { IClient } from "../../Models/IClient";
import { IDevice } from "../../Models/IDevice";
import { ClientsService, DevicesService } from "../../Utils";
import { CustomTextField } from "./TextField/CustomTextField";


const getDefaultClient = (): IClient => (
  {
    id:"",
    name:"",
    username:"",
    password:"",
    address:"",
    age:19,
    admin:false
  });


export const ClientsPage = (): JSX.Element => {
  const [selectedItems, setSelectedItems] = useState<Object[] | undefined>(undefined);
  const [selectedClient,setSelectedClient] = useState<IClient>(getDefaultClient);
  const [updateTable,setUpdateTable] = useState<string>("id");
  const [rows,setRows] = useState<IClient[]>([]);
  const [enableForm, setEnableForm] = useState<boolean>(false);
  const response:IAxiosResult<IClient[]> = UseAxios(ClientsService.GET_ALL_CLIENTS,'GET',[updateTable]);


  /// --- devices
  const [showDevices, setShowDevices] = useState<boolean>(false);
  const [selectedClientForDevices,setSelectedClientForDevices] = useState<IClient>();
  const responseDevices:IAxiosResult<IDevice[]> = UseAxios(DevicesService.GET_DEVICES_BY_CLIENT_ID+selectedClientForDevices?.id,'GET',[selectedClientForDevices]);
  const [devicesRows, setDevicesRows] = useState<IDevice[]>([]);
  const [selectedDeviceItems, setSelectedDeviceItems] = useState<Object[] | undefined>(undefined);
  
  const [selectionDevice] = useState<Selection>(() => new Selection({
    onSelectionChanged: () => {
      setSelectedDeviceItems(selectionDevice.getSelection());
    }
}));

  // un attached devices 
  const responseUnAttachedDevices:IAxiosResult<IDevice[]> = UseAxios(DevicesService.GET_ALL_DEVICES,'GET',[selectedClientForDevices]);
  const [unAttachedDevicesRows, setUnAttachedDevicesRows] = useState<IDevice[]>([]);
  const [selectedUnAttachedDeviceItems, setSelectedUnAttachedDeviceItems] = useState<Object[] | undefined>(undefined);

  const [selectionUnAttachedDevice] = useState<Selection>(() => new Selection({
    onSelectionChanged: () => {
      setSelectedUnAttachedDeviceItems(selectionUnAttachedDevice.getSelection());
    }
  }));
  


  useEffect(() => {
    if(response.Data === null)
      return;
      console.log(response.Data)
      setRows(response.Data);
  },[response])
  
  const [selection] = useState<Selection>(() => new Selection({
      onSelectionChanged: () => {
          setSelectedItems(selection.getSelection());
      }
  }));

  const getSelectedItem = (): IObjectWithKey => {
      return selectedItems[0];
  };

  const columns:IColumn[] = [      
    { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column3', name: 'Address', fieldName: 'address', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column4', name: 'Age', fieldName: 'age', minWidth: 100, maxWidth: 200, isResizable: true }]
  

  const cancelForm = () => {
    setEnableForm(false);
    setSelectedClient(getDefaultClient);
  }

  const shouldEdit = () => {

    let client: IClient = selectedClient;
    client.name = client.name+"";
    
    client.address=client.address+""

    axios(config(ClientsService.ADD_CLIENT,'POST',client))
    .then((_) => {
      setUpdateTable(updateTable.split("").reverse().join(""));
      console.log("edited")
    })
    .catch((_) => {
    });
    setEnableForm(false);
    setSelectedClient(getDefaultClient)
  }


  const handleAdd = () => {
    setSelectedClient(getDefaultClient)
    setEnableForm(true);
    
}
  const handleEdit = () => {
    if(selectedItems === undefined )
      return;
    const itemToView = JSON.stringify(getSelectedItem());
    let client: IClient = JSON.parse(itemToView);
    setSelectedClient(client);
    setEnableForm(true);
}

  const handleDelete = () => {
    const itemToView = JSON.stringify(getSelectedItem());
    let client: IClient = JSON.parse(itemToView);
    axios(config(ClientsService.DELETE_CLIENT_BY_ID+client.id,'DELETE'))
    .then((_) => {
      setUpdateTable(updateTable.split("").reverse().join(""));
      console.log("deleted")
    })
    .catch((_) => {
    });
  }

  const handleFieldChange = (field:string, e: React.ChangeEvent<HTMLInputElement>) => {
    let newClient:IClient = {...selectedClient}

    switch(field){
      case "name": {
        newClient["name"] = e.target.value;
        break;
      }
      case "username": {
        newClient["username"] = e.target.value;
        break;
      }
      case "password": {
        newClient["password"] = e.target.value;
        break;
      }
      case "address": {
        newClient["address"] = e.target.value;
        break;
      }
      case "age": {
        newClient["age"] = +e.target.value;
        break;
      }
    }
    
    setSelectedClient(newClient)
  };
  /// -------------------------------------------  devices

  const getSelectedDeviceItem = (): IObjectWithKey => {
    return selectedDeviceItems[0];
  };

  const getSelectedUnAttachedDeviceItem = (): IObjectWithKey => {
    return selectedUnAttachedDeviceItems[0];
  };

  const handleShowDevices = (): void => {
    if(selectedItems === undefined )
      return;
    const itemToView = JSON.stringify(getSelectedItem());
    let client: IClient = JSON.parse(itemToView);
    setSelectedClientForDevices(client);
    setShowDevices(!showDevices);
   
  }

  useEffect(() => {
    if(responseDevices.Data === null)
      return;
      console.log(responseDevices.Data)
      setDevicesRows(responseDevices.Data);
  },[responseDevices]);

  useEffect(() => {
    if(responseUnAttachedDevices.Data === null)
      return;
      console.log(responseUnAttachedDevices.Data)
      setUnAttachedDevicesRows(responseUnAttachedDevices.Data);
  },[responseUnAttachedDevices]);

  const devicesColumns:IColumn[] = [      
    { key: 'columnDevice0', name: 'id', fieldName: 'id', minWidth: 100, maxWidth: 200, isResizable: true },      
    { key: 'columnDevice1', name: 'Description', fieldName: 'description', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'columnDevice3', name: 'Address', fieldName: 'address', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'columnDevice4', name: 'MaxEnergyConsumpt', fieldName: 'maxEnergyConsumpt', minWidth: 100, maxWidth: 200, isResizable: true },    
    { key: 'columnDevice5', name: 'AvgEnergyConsumpt', fieldName: 'avgEnergyConsumpt', minWidth: 100, maxWidth: 200, isResizable: true } ]


    const handleDetach = ():void => {
      if(selectedDeviceItems === undefined )
        return;
        const itemToView = JSON.stringify(getSelectedDeviceItem());
        let device: IDevice = JSON.parse(itemToView);
        
        axios(config(DevicesService.REMOVE_CLIENT_BY_DEVICE_ID+device.id,'POST'))
        .then((_) => {
          handleShowDevices();
          setShowDevices(true);
          console.log("detach")
        })
        .catch((_) => {
        });
    };

    const handleAttach = ():void => {
      if(selectedUnAttachedDeviceItems === undefined )
        return;
      if(selectedItems === undefined )
        return;
      const itemToView = JSON.stringify(getSelectedItem());
      let client: IClient = JSON.parse(itemToView);
      const itemToView2 = JSON.stringify(getSelectedUnAttachedDeviceItem());
      let device: IDevice = JSON.parse(itemToView2);

      axios(config(DevicesService.SET_CLIENT_BY_DEVICE_ID+device.id,'POST', client ))
      .then((_) => {
        setUpdateTable(updateTable.split("").reverse().join(""));
        handleShowDevices();
        setShowDevices(true);
        console.log("attached")
      })
      .catch((_) => {
      });
    };
    return (
    <div>
        {enableForm &&
        <Stack style={{width:"80%", paddingLeft:"30px"}}> 
          <StackItem>
            <CustomTextField
                textFieldLabel={"Name"} 
                textContent={selectedClient.name} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("name",e)}        
              />
          </StackItem>
          <StackItem>
            <CustomTextField
                textFieldLabel={"UserName"} 
                textContent={selectedClient.username} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("username",e)}        
              />
          </StackItem>
          <StackItem>
            <CustomTextField
                textFieldLabel={"Password"} 
                textContent={selectedClient.password} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("password",e)}        
              />
          </StackItem>
          <StackItem>
            <CustomTextField
                textFieldLabel={"Address"} 
                textContent={selectedClient.address} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("address",e)}        
            />
          </StackItem>
          <StackItem>
          <CustomTextField
              textFieldLabel={"Age"} 
              textContent={selectedClient.age+""} 
              errorMessage={""} 
              sectionChanged={(e) => handleFieldChange("age",e)}        
          />
          </StackItem>
          <StackItem>
            <Button onClick={shouldEdit}>Save</Button>
            <Button onClick={cancelForm}>Cancel</Button>
          </StackItem>
        </Stack>
        }

        <Stack style={{width:"80%", paddingLeft:"30px"}}>
          <StackItem>
            Clients
          </StackItem>
          <StackItem>
            <Button onClick={handleAdd}>Add</Button>
            <Button onClick={handleEdit}>Edit</Button>
            <Button onClick={handleDelete}>Delete</Button>
            <Button onClick={handleShowDevices}>Devices</Button>
          </StackItem>
          <StackItem>
            <ShimmeredDetailsList
                        
                        items={rows}
                        columns={columns}
                        setKey="set"
                        selectionMode={SelectionMode.single}
                        layoutMode={DetailsListLayoutMode.justified}
                        selection={selection}
                        selectionPreservedOnEmptyClick={true}
                        enableShimmer={false}
                    />
            </StackItem>
            {showDevices &&
              <Stack>
                <StackItem>
                  Associated devices
                </StackItem>
                <StackItem>
                  <ShimmeredDetailsList
                            items={devicesRows}
                            columns={devicesColumns}
                            setKey="set"
                            selectionMode={SelectionMode.single}
                            layoutMode={DetailsListLayoutMode.justified}
                            selection={selectionDevice}
                            selectionPreservedOnEmptyClick={true}
                            enableShimmer={false}
                        />
                </StackItem>
                <StackItem>
                  <Button onClick={handleDetach}>Detach device</Button>
                </StackItem>
                <StackItem>
                  Available devices
                </StackItem>
                <StackItem>
                <ShimmeredDetailsList
                            items={unAttachedDevicesRows}
                            columns={devicesColumns}
                            setKey="set"
                            selectionMode={SelectionMode.single}
                            layoutMode={DetailsListLayoutMode.justified}
                            selection={selectionUnAttachedDevice}
                            selectionPreservedOnEmptyClick={true}
                            enableShimmer={false}
                        />
                </StackItem>
                <StackItem>
                  <Button onClick={handleAttach}>Attach device</Button>
                </StackItem>
              </Stack>

            }
        </Stack>
    </div>
  );
}
