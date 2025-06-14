export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
  Blocked = "Blocked",
  Suspended = "Suspended"
}


export type User={
    Record_ID:number;
    Teacher_Name:string;
    Teacher_ID:number;
    Department:string;
    Student:number;
    Status:UserStatus
}