import { DetailsListLayoutMode, IColumn, IObjectWithKey, Selection, SelectionMode, ShimmeredDetailsList, Stack, StackItem } from "@fluentui/react";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { config, IAxiosResult, UseAxios } from "../../Axios/UseAxios";
import { IDevice } from "../../Models/IDevice";
import { ISensor } from "../../Models/ISensor";
import { DevicesService, SensorsService } from "../../Utils";
import { CustomTextField } from "../ClientsPage/TextField/CustomTextField";



const getDefaultDevice = (): IDevice => (
  {
    id:"",
    description: "",
    address: "",
    maxEnergyConsumpt: "0.0",
    avgEnergyConsumpt: "0.0"
  });


export const DevicesPage = (): JSX.Element => {
  const [selectedItems, setSelectedItems] = useState<Object[] | undefined>(undefined);
  const [selectedDevice,setSelectedDevice] = useState<IDevice>(getDefaultDevice);
  const [updateTable,setUpdateTable] = useState<string>("id");
  const [rows,setRows] = useState<IDevice[]>([]);
  const [enableForm, setEnableForm] = useState<boolean>(false);
  const response:IAxiosResult<IDevice[]> = UseAxios(DevicesService.GET_ALL_DEVICES,'GET',[updateTable]);
  const [showSensors, setShowSensors] = useState<boolean>(false);

  // -------------- sensors
  const [selectedDeviceForSensors, setSelectedDeviceForSensors] = useState<IDevice>();
  const [selectedSensorsItems, setSelectedSensorsItems] = useState<Object[] | undefined>(undefined);
  const [sensorsRows,setSensorsRows] = useState<ISensor[]>([]);
  const sensorsResponse:IAxiosResult<ISensor[]> = UseAxios(SensorsService.GET_ALL_SENSORS,'GET',[updateTable]);

useEffect(() => {
  if(sensorsResponse.Data === null)
    return;
    setSensorsRows(sensorsResponse.Data);
},[sensorsResponse])

// assigned sensors --------------
const [selectedAttachedSensorsItems, setSelectedAttachedSensorsItems] = useState<Object[] | undefined>(undefined);
const [sensorsAttachedRows,setSensorsAttachedRows] = useState<ISensor[]>([]);
const sensorsAttachedResponse:IAxiosResult<ISensor[]> = UseAxios(SensorsService.GET_SENSORS_BY_DEVICE_ID+selectedDeviceForSensors?.id,'GET',[selectedDeviceForSensors]);


useEffect(() => {
  if(sensorsAttachedResponse.Data === null)
    return;
    setSensorsAttachedRows(sensorsAttachedResponse.Data);
},[sensorsAttachedResponse])


useEffect(() => {
  if(response.Data === null)
    return;
    console.log(response.Data)
    setRows(response.Data);
},[response])

const [selectionAttachedSensors] = useState<Selection>(() => new Selection({
  onSelectionChanged: () => {
    setSelectedAttachedSensorsItems(selectionAttachedSensors.getSelection());
  }
}));

const [selectionSensors] = useState<Selection>(() => new Selection({
    onSelectionChanged: () => {
      setSelectedSensorsItems(selectionSensors.getSelection());
    }
}));

const getSelectedSensorsItem = (): IObjectWithKey => {
    return selectedSensorsItems[0];
};

const getSelectedAttachedSensorsItem = (): IObjectWithKey => {
  return selectedAttachedSensorsItems[0];
};

const columnsSensors:IColumn[] = [
  { key: 'column0', name: 'id', fieldName: 'id', minWidth: 100, maxWidth: 200, isResizable: true },      
  { key: 'column1', name: 'Description', fieldName: 'description', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'column3', name: 'MaxValue', fieldName: 'maxValue', minWidth: 100, maxWidth: 200, isResizable: true }, 

]

// ---------------

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
    { key: 'column0', name: 'id', fieldName: 'id', minWidth: 100, maxWidth: 200, isResizable: true },      
    { key: 'column1', name: 'Description', fieldName: 'description', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column3', name: 'Address', fieldName: 'address', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column4', name: 'MaxEnergyConsumpt', fieldName: 'maxEnergyConsumpt', minWidth: 100, maxWidth: 200, isResizable: true },    
    { key: 'column5', name: 'AvgEnergyConsumpt', fieldName: 'avgEnergyConsumpt', minWidth: 100, maxWidth: 200, isResizable: true }    

]
  

  const cancelForm = () => {
    setEnableForm(false);
    setSelectedDevice(getDefaultDevice);
  }

  const shouldEdit = () => {

    let client: IDevice = selectedDevice;

    axios(config(DevicesService.ADD_DEVICE,'POST',client))
    .then((_) => {
      setUpdateTable(updateTable.split("").reverse().join(""));
      console.log("edited")
    })
    .catch((_) => {
    });
    setEnableForm(false);
    setSelectedDevice(getDefaultDevice)
  }


  const handleAdd = () => {
    setSelectedDevice(getDefaultDevice)
    setEnableForm(true);
    
}
  const handleEdit = () => {
    if(selectedItems === undefined )
      return;
    const itemToView = JSON.stringify(getSelectedItem());
    let client: IDevice = JSON.parse(itemToView);
    setSelectedDevice(client);
    setEnableForm(true);
}

  const handleDelete = () => {
    const itemToView = JSON.stringify(getSelectedItem());
    let client: IDevice = JSON.parse(itemToView);
    axios(config(DevicesService.DELETE_DEVICE_BY_ID+client.id,'DELETE'))
    .then((_) => {
      setUpdateTable(updateTable.split("").reverse().join(""));
      console.log("deleted")
    })
    .catch((_) => {
    });
  }

  const handleFieldChange = (field:string, e: React.ChangeEvent<HTMLInputElement>) => {
    let newClient:IDevice = {...selectedDevice}

    switch(field){
        case "id": {
            newClient["id"] = e.target.value;
            break;
          }
      case "description": {
        newClient["description"] = e.target.value;
        break;
      }
      case "address": {
        newClient["address"] = e.target.value;
        break;
      }
      case "maxEnergyConsumpt": {
        newClient["maxEnergyConsumpt"] = e.target.value;
        break;
      }
      case "avgEnergyConsumpt": {
        newClient["avgEnergyConsumpt"] = e.target.value;
        break;
      }
    }
    
    setSelectedDevice(newClient)
  };

    const handleShowSensors = () => {
      if(selectedItems === undefined )
        return;
      const itemToView = JSON.stringify(getSelectedItem());
      let device: IDevice = JSON.parse(itemToView);
      setSelectedDeviceForSensors(device);
      console.log(device);
      setShowSensors(!showSensors);
    }

    // sensors ----------------------------
    const handleAttach = () => {
      if(selectedSensorsItems === undefined || selectedItems === undefined)
        return;

      const itemToView2 = JSON.stringify(getSelectedItem());
      let device: IDevice = JSON.parse(itemToView2);
      const itemToView = JSON.stringify(getSelectedSensorsItem());
      let sensor: ISensor = JSON.parse(itemToView);
      console.log(sensor);
      axios(config(SensorsService.ADD_DEVICE_BY_SENSOR_ID+sensor.id,'POST', device ))
      .then((_) => {
        setUpdateTable(updateTable.split("").reverse().join(""));
        handleShowSensors()
        setShowSensors(true);
        console.log("attached")
      })
      .catch((_) => {
      });
    }

    const handleDetach = () => {
      
      if(selectedAttachedSensorsItems === undefined )
        return;
      const itemToView = JSON.stringify(getSelectedAttachedSensorsItem());
      let sensor: ISensor = JSON.parse(itemToView);
      console.log(sensor);

      axios(config(SensorsService.REMOVE_DEVICE_BY_SENSOR_ID+sensor.id,'POST'))
      .then((_) => {
        handleShowSensors()
        setShowSensors(true);
        console.log("detach")
      })
      .catch((_) => {
      });
    }
    return (
    <div>
        {enableForm &&
        <Stack style={{width:"80%", paddingLeft:"30px"}}> 
          <StackItem>
            <CustomTextField
                textFieldLabel={"Id"} 
                textContent={selectedDevice.id} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("id",e)}        
              />
          </StackItem>
          <StackItem>
            <CustomTextField
                textFieldLabel={"Description"} 
                textContent={selectedDevice.description} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("description",e)}        
              />
          </StackItem>
          <StackItem>
            <CustomTextField
                textFieldLabel={"Address"} 
                textContent={selectedDevice.address} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("address",e)}        
              />
          </StackItem>
          <StackItem>
            <CustomTextField
                textFieldLabel={"maxEnergyConsumpt"} 
                textContent={selectedDevice.maxEnergyConsumpt} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("maxEnergyConsumpt",e)}        
              />
          </StackItem>
          <StackItem>
            <CustomTextField
                textFieldLabel={"avgEnergyConsumpt"} 
                textContent={selectedDevice.avgEnergyConsumpt} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("avgEnergyConsumpt",e)}        
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
            Devices
          </StackItem>
          <StackItem>
            <Button onClick={handleAdd}>Add</Button>
            <Button onClick={handleEdit}>Edit</Button>
            <Button onClick={handleDelete}>Delete</Button>
            <Button onClick={handleShowSensors}>Sensors</Button>
          </StackItem>
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
        </Stack>
        {showSensors &&
        <Stack>
            <StackItem>
              Sensors
            </StackItem>
            <StackItem>
              Attached Sensors
            <ShimmeredDetailsList
                        
                        items={sensorsAttachedRows}
                        columns={columnsSensors}
                        setKey="set"
                        selectionMode={SelectionMode.single}
                        layoutMode={DetailsListLayoutMode.justified}
                        selection={selectionAttachedSensors}
                        selectionPreservedOnEmptyClick={true}
                        enableShimmer={false}
                    />
            </StackItem>
            <StackItem>
            <Button onClick={handleDetach}>Detach sensor</Button>
            </StackItem>
            <StackItem>
              Available sensors
            <ShimmeredDetailsList
                        
                        items={sensorsRows}
                        columns={columnsSensors}
                        setKey="set"
                        selectionMode={SelectionMode.single}
                        layoutMode={DetailsListLayoutMode.justified}
                        selection={selectionSensors}
                        selectionPreservedOnEmptyClick={true}
                        enableShimmer={false}
                    />
            </StackItem>
            <StackItem>
            <Button onClick={handleAttach}>Attach sensor</Button>
              
            </StackItem>
        </Stack>
        }
    </div>
  );
}