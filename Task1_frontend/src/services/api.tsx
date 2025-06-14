import { BehaviorSubject } from "rxjs";
import { User } from "../types/TableTypes";

export const Users$ = new BehaviorSubject<User[]>([]);
export const fetchUsers = async()=>{
    const key = process.env.REACT_APP_API_KEY | '6e8902a0';
    const response = await fetch(`https://api.mockaroo.com/api/generate.json?key=${key}&count=100&schema=Graphkting`);
    if(!response.ok) throw new Error("Failed to fetch Data");
    const data= await response.json();
    console.log(data);
    Users$.next(data);
}
