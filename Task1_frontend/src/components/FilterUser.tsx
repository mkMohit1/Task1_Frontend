import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";

const StatusColor: Record<string, string> = {
  Active: "#2FB400",
  Inactive: "#FFA800",
  Blocked: "#DA0000",
  Suspended: "#EE7200",
};

interface FilterProps {
  department: string[];
  selectedStatuses: string[];
  selectedDepartments: string[];
  onFilterChange: (type: 'status' | 'department', selected: string[]) => void;
}


const FilterUsers = ({ department, selectedStatuses, selectedDepartments, onFilterChange} : FilterProps) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);

  const statuses = ["All", "Active", "Inactive", "Blocked", "Suspended"];
  const [booleanStatus, setBooleanStatus] = useState([false, false, false, false, false]);
  const [booleanDepartment, setBooleanDepartment] = useState(
    [...department.map(() => false)]
  );

  const handleUpdate = (index: number, container: 'status' | 'department') => {
  const data = container === "status" ? statuses : department;
  const current = container === "status" ? [...booleanStatus] : [...booleanDepartment];

  if (index === 0) {
    const isAllSelected = current.every(Boolean);
    const updated = current.map(() => !isAllSelected);
    container === "status" ? setBooleanStatus(updated) : setBooleanDepartment(updated);
    const selected = !isAllSelected ? data.slice(1) : [];
    onFilterChange(container, selected);
  } else {
    current[index] = !current[index];
    if (current[0]) current[0] = false;
    container === "status" ? setBooleanStatus(current) : setBooleanDepartment(current);

    const selected = data
      .map((val, idx) => (idx !== 0 && current[idx] ? val : null))
      .filter(Boolean) as string[];
    onFilterChange(container, selected);
  }
};


  const renderFilterSection = (
    title: string,
    open: boolean,
    toggleOpen: () => void,
    data: string[],
    selected: boolean[],
    onToggle: (index: number) => void
  ) => (
    <>
      <div className={`flex items-center justify-between py-1 mb-2`}>
        <h3 className={`text-lg font-semibold ${open ? "text-[#034DB0]" : ""}`}>{title}</h3>
        <button
          onClick={toggleOpen}
          className="text-gray-600 hover:text-black"
        >
          <FontAwesomeIcon icon={open ? faTimes : faChevronDown} className={`${open ? "text-[#034DB0]" : ""}`} />
        </button>
      </div>
      {open && (
        <ul className="space-y-2 mt-2 pl-0">
          {data.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <label htmlFor={`${title}-${item}`} className="text-sm flex items-center gap-2 cursor-pointer">
                {item}
                {title === "Status" && item !== "All" && (
                  <div
                    className="w-[7px] h-[7px] rounded-full inline-block"
                    style={{ backgroundColor: StatusColor[item] }}
                  ></div>
                )}
              </label>
              <input
                id={`${title}-${item}`}
                type="checkbox"
                checked={selected[index]}
                onChange={() => onToggle(index)}
                className="accent-blue-600"
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div className="container mx-auto p-2">
      <div className="max-w-[200px] bg-white shadow-md rounded-lg p-4 space-y-4">
        <div className="font-semibold">
          Data Filter
        </div>
        {renderFilterSection(
          "Status",
          statusOpen,
          () => setStatusOpen((prev) => !prev),
          statuses,
          booleanStatus,
          (i) => handleUpdate(i, "status")
        )}
        {renderFilterSection(
          "Department",
          departmentOpen,
          () => setDepartmentOpen((prev) => !prev),
          [...department],
          [...booleanDepartment],
          (i) => handleUpdate(i, "department")
        )}
      </div>
    </div>
  );
};

export default FilterUsers;
