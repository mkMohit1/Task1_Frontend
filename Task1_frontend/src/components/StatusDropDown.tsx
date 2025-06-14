import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


const StatusColor: Record<string, string> = {
  Active: "#2FB400",
  Inactive: "#FFA800",
  Blocked: "#DA0000",
  Suspended: "#EE7200",
};

const statuses = Object.keys(StatusColor);

interface Props {
  status: string;
  Record_ID:number;
   onStatusChange?: (id: number, newStatus: string) => void;
}

const StatusDropdown=({ status, Record_ID, onStatusChange }:Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm focus:outline-none"
      >
        {status}
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: StatusColor[status] }}
        ></span>
         <FontAwesomeIcon icon={faChevronDown} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-40 rounded-md bg-white shadow-lg border">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                onStatusChange?.(Record_ID,s);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {s}
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: StatusColor[s] }}
              ></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
