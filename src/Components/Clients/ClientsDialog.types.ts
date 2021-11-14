import { IClient } from "../../Models/IClient";

export interface IClientsCEVA {
    name: string;
    client:IClient;
    sectionChanged: (event: any) => void;
}