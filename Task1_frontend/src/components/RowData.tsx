import React, { use } from "react";
import {  User } from "../types/TableTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import StatusDropdown from "./StatusDropDown";

interface RowDataProps {
    paginated: User[];
    onStatusChange?: (id: number, newStatus: string) => void;
}

const rowData = ({paginated,onStatusChange}:RowDataProps) => {
    const statuses = ["Active", "Inactive", "Blocked", "Suspended"];
    return (
        <>


            {
                paginated.map((user) => (
                    <div className="mt-1 py-2 w-full border-b-2">
                        <div className="flex flex-row gap-2 w-full text-center ">
                            <div className="flex-1 text-black">{user.Record_ID}</div>
                            <div className="flex-[2]">{user.Teacher_Name}</div> {/* Wider */}
                            <div className="flex-1">{user.Teacher_ID}</div>
                            <div className="flex-1">{user.Department}</div>
                            <div className="flex-1">{user.Student}</div>
                            {/* ✅ Status Dropdown */}
                            <div className="flex-1">
                            <StatusDropdown
                                status={user.Status}
                                Record_ID={user.Record_ID}
                                onStatusChange={onStatusChange}
                                />
                            </div>
                            <div className="flex-1"><a href="#" className="no-underline text-blue-600 hover:underline">View More &gt;</a></div>
                        </div>
                    </div>
                ))
            }

        </>
    );
}

export default rowData;