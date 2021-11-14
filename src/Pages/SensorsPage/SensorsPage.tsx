import { DetailsListLayoutMode, IColumn, IObjectWithKey, Selection, SelectionMode, ShimmeredDetailsList, Stack, StackItem } from "@fluentui/react";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { config, IAxiosResult, UseAxios } from "../../Axios/UseAxios";
import { ISensor } from "../../Models/ISensor";
import { SensorsService } from "../../Utils";
import { CustomTextField } from "../ClientsPage/TextField/CustomTextField";



const getDefaultSensor = (): ISensor => (
  {
    id:"",
    description: "",
    maxValue:""
  });


export const SensorsPage = (): JSX.Element => {
  const [selectedItems, setSelectedItems] = useState<Object[] | undefined>(undefined);
  const [selectedSensor,setSelectedSensor] = useState<ISensor>(getDefaultSensor);
  const [updateTable,setUpdateTable] = useState<string>("id");
  const [rows,setRows] = useState<ISensor[]>([]);
  const [enableForm, setEnableForm] = useState<boolean>(false);
  const response:IAxiosResult<ISensor[]> = UseAxios(SensorsService.GET_ALL_SENSORS,'GET',[updateTable]);

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
    { key: 'column3', name: 'MaxValue', fieldName: 'maxValue', minWidth: 100, maxWidth: 200, isResizable: true }, 

]
  

  const cancelForm = () => {
    setEnableForm(false);
    setSelectedSensor(getDefaultSensor);
  }

  const shouldEdit = () => {

    let client: ISensor = selectedSensor;

    axios(config(SensorsService.ADD_SENSOR,'POST',client))
    .then((_) => {
      setUpdateTable(updateTable.split("").reverse().join(""));
      console.log("edited")
    })
    .catch((_) => {
    });
    setEnableForm(false);
    setSelectedSensor(getDefaultSensor)
  }


  const handleAdd = () => {
    setSelectedSensor(getDefaultSensor)
    setEnableForm(true);
    
}
  const handleEdit = () => {
    if(selectedItems === undefined )
      return;
    const itemToView = JSON.stringify(getSelectedItem());
    let client: ISensor = JSON.parse(itemToView);
    setSelectedSensor(client);
    setEnableForm(true);
}

  const handleDelete = () => {
    const itemToView = JSON.stringify(getSelectedItem());
    let client: ISensor = JSON.parse(itemToView);
    axios(config(SensorsService.DELETE_SENSOR_BY_ID+client.id,'DELETE'))
    .then((_) => {
      setUpdateTable(updateTable.split("").reverse().join(""));
      console.log("deleted")
    })
    .catch((_) => {
    });
  }

  const handleFieldChange = (field:string, e: React.ChangeEvent<HTMLInputElement>) => {
    let newClient: ISensor = {...selectedSensor}

    switch(field){
        case "id": {
            newClient["id"] = e.target.value;
            break;
          }
      case "description": {
        newClient["description"] = e.target.value;
        break;
      }
      case "maxValue": {
        newClient["maxValue"] = e.target.value;
        break;
      }
    }
    
    setSelectedSensor(newClient)
  };

    return (
    <div>
        {enableForm &&
        <Stack style={{width:"80%", paddingLeft:"30px"}}> 
          <StackItem>
            <CustomTextField
                textFieldLabel={"Id"} 
                textContent={selectedSensor.id} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("id",e)}        
              />
          </StackItem>
          <StackItem>
            <CustomTextField
                textFieldLabel={"Description"} 
                textContent={selectedSensor.description} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("description",e)}        
              />
          </StackItem>
          <StackItem>
            <CustomTextField
                textFieldLabel={"maxValue"} 
                textContent={selectedSensor.maxValue} 
                errorMessage={""} 
                sectionChanged={(e) => handleFieldChange("maxValue",e)}        
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
            Sensors
          </StackItem>
          <StackItem>
            <Button onClick={handleAdd}>Add</Button>
            <Button onClick={handleEdit}>Edit</Button>
            <Button onClick={handleDelete}>Delete</Button>
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
    </div>
  );
}