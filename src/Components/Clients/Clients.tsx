import { IObjectWithKey, Selection, Stack, StackItem } from "@fluentui/react";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { config, IAxiosResult, UseAxios } from "../../Axios/UseAxios";
import { IClient } from "../../Models/IClient";
import { CustomTextField } from "../../Pages/ClientsPage/TextField/CustomTextField";
import { ClientsService } from "../../Utils";


const getDefaultClient = (): IClient => (
  {
    id:"",
    name:"",
    username:"",
    password:"",
    address:"",
    age:19,
    admin:false
  } );

export const Clients = () => {
  const [selectedItems, setSelectedItems] = useState<Object[] | undefined>(undefined);
  const [selectedClient,setSelectedClient] = useState<IClient>(getDefaultClient);
  const [updateTable,setUpdateTable] = useState<string>("id");
  const [rows,setRows] = useState<IClient[]>([]);
  const [enableForm, setEnableForm] = useState<boolean>(false);
  const response:IAxiosResult<IClient[]> = UseAxios(ClientsService.GET_ALL_CLIENTS,'GET',[updateTable]);

  useEffect(() => {
    if(response.Data === null)
      return;

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
      setUpdateTable(client.id)
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
      setUpdateTable(client.id)
      console.log("deleted")
    })
    .catch((_) => {
    });
  }


  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newClient = {...selectedClient}
    newClient.name = e.target.value;
    setSelectedClient(newClient)
  };
  const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newClient = {...selectedClient}
    newClient.address = e.target.value;
    setSelectedClient(newClient)
  };
  const handleChangeAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newClient = {...selectedClient}
    newClient.age = +e.target.value;
    setSelectedClient(newClient)
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
                sectionChanged={handleChangeName}        
              />
          </StackItem>
          <StackItem>
            <CustomTextField
                textFieldLabel={"Address"} 
                textContent={selectedClient.address} 
                errorMessage={""} 
                sectionChanged={handleChangeAddress}        
            />
          </StackItem>
          <StackItem>
          <CustomTextField
              textFieldLabel={"Address"} 
              textContent={selectedClient.age+""} 
              errorMessage={""} 
              sectionChanged={handleChangeAge}        
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
          </StackItem>
          {/* <ShimmeredDetailsList
                        
                        items={rows}
                        columns={columns}
                        setKey="set"
                        selectionMode={SelectionMode.multiple}
                        layoutMode={DetailsListLayoutMode.justified}
                        selection={selection}
                        selectionPreservedOnEmptyClick={true}
                        enableShimmer={false}
                    /> */}
                    {rows}
        </Stack>
    </div>
  );
}