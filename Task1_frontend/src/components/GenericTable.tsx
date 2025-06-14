import React, { useState, useEffect, useRef } from "react";
import { Users$ } from "../services/api";
import { User, UserStatus } from "../types/TableTypes";
import { Subscription } from "rxjs";
import RowData from "./RowData";
import RenderPageNumbers from "./RenderPageNumbers";
import SearchContainer from "./SearchContainer";
import FilterUsers from "./FilterUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 10;

export const UserTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [department, setDepartment] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [loading, setLoading] = useState(true); // 👈 loading state
  const [showFilter, setShowFilter] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoading(true); // 👈 start loading
    const sub: Subscription = Users$.subscribe(users => {
      setData(users);
      setLoading(false); // 👈 stop loading once data is received
    });

    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
  }, [search]);

  useEffect(() => {
    if (data.length > 0) {
      const uniqueDepartment = ["All", ...new Set(data.map(item => item.Department))];
      setDepartment(uniqueDepartment);
    }
  }, [data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filterUsers = (users: User[], query: string): User[] => {
    const lowerQuery = query.toLowerCase();
    return users.filter(user => {
      const matchesQuery = [user.Teacher_Name, user.Teacher_ID, user.Department, user.Student, user.Status]
        .some(val => String(val).toLowerCase().includes(lowerQuery));

      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(user.Status);
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(user.Department);

      return matchesQuery && matchesStatus && matchesDepartment;
    });
  };

  const filtered = filterUsers(data, debouncedSearch);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  const onStatusChange = (id: number, newStatus: string) => {
    const updatedUsers = Users$.getValue().map(user =>
      user.Record_ID === id ? { ...user, Status: newStatus as UserStatus } : user
    );
    Users$.next(updatedUsers);
  };

  const handleFilterChange = (type: 'status' | 'department', selected: string[]) => {
    if (type === 'status') setSelectedStatuses(selected);
    else setSelectedDepartments(selected);
  };

  return (
    <div className="py-6 px-[6rem]">
      <div className="container mb-3">
        <div className="py-2 w-full">
          <div className="flex flex-row min-w-md gap-2 w-full">
            <SearchContainer search={search} handleSearchChange={handleSearchChange} />
            <div className="relative">
              <button
                onClick={() => setShowFilter(prev => !prev)}
                className="ml-2 p-2 h-[45px] border rounded text-[#034DB0] hover:bg-[#034DB0] hover:text-white"
              >
                <FontAwesomeIcon icon={faFilter} className="mr-1" />
              </button>
              {showFilter && (
                <div className="absolute left-[-20px]">
                  <FilterUsers
                    department={department}
                    selectedStatuses={selectedStatuses}
                    selectedDepartments={selectedDepartments}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔄 Loading Case */}
      {loading ? (
        <div className="text-center my-10 text-[#034DB0] font-semibold">Loading users...</div>
      ) : (
        <>
          <div className="container mb-3">
            <div className="py-2 w-full border-b-2 bg-primary rounded-2xl">
              <div className="flex flex-row min-w-md gap-2 w-full text-center text-white font-semibold">
                <div className="flex-1">Recode ID</div>
                <div className="flex-[2]">Teacher Name</div>
                <div className="flex-1">Teacher ID</div>
                <div className="flex-1">Department</div>
                <div className="flex-1">Student</div>
                <div className="flex-1">Status</div>
                <div className="flex-1">All Details</div>
              </div>
            </div>
            <RowData paginated={paginated} onStatusChange={onStatusChange} />
          </div>

          {/* Pagination */}
          <div className="container flex justify-center">
            <span
              onClick={() => page > 1 && setPage(1)}
              className={`w-[35px] h-[35px] rounded-full mx-1 text-[15px] inline-flex items-center justify-center cursor-pointer ${
                page === 1 ? 'bg-gray-200 text-[#034DB0]' : ' text-[#034DB0] border border-[#034DB0] hover:bg-[#034DB0] hover:text-white'
              }`}
            >
              &lt;&lt;
            </span>
            <span
              onClick={() => page > 1 && setPage(page - 1)}
              className={`w-[35px] h-[35px] rounded-full mx-1 text-[15px] inline-flex items-center justify-center cursor-pointer ${
                page === 1 ? 'bg-gray-200 text-[#034DB0]' : ' text-[#034DB0] border border-[#034DB0] hover:bg-[#034DB0] hover:text-white'
              }`}
            >
              &lt;
            </span>
            <RenderPageNumbers pageCount={pageCount} handlePage={setPage} page={page} />
            <span
              onClick={() => page < pageCount && setPage(page + 1)}
              className={`w-[35px] h-[35px] rounded-full mx-1 text-[15px] inline-flex items-center justify-center cursor-pointer ${
                page === pageCount ? 'bg-gray-200 text-[#034DB0]' : ' text-[#034DB0] border border-[#034DB0] hover:bg-[#034DB0] hover:text-white'
              }`}
            >
              &gt;
            </span>
            <span
              onClick={() => page < pageCount && setPage(pageCount)}
              className={`w-[35px] h-[35px] rounded-full mx-1 text-[15px] inline-flex items-center justify-center cursor-pointer ${
                page === pageCount ? 'bg-gray-200 text-[#034DB0]' : ' text-[#034DB0] border border-[#034DB0] hover:bg-[#034DB0] hover:text-white'
              }`}
            >
              &gt;&gt;
            </span>
          </div>
        </>
      )}
    </div>
  );
};
