import React from "react";
interface RenderPageNumbersProp{
    pageCount:number;
    page:number;
    handlePage:(i:number)=>void;
}
const RenderPageNumbers = ({pageCount,page,handlePage}:RenderPageNumbersProp) => {
        const pages:(number | string)[] = [];
        if(pageCount <=7){
            for(let i=1;i<=pageCount;i++) pages.push(i);
        }else{
            pages.push(1);
            if(page>4) pages.push("...");
            const startPage = Math.max(2, page-1);
            const endPage = Math.min(pageCount-1, page+1);
            for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
            }
            if (page < pageCount - 3) pages.push("...");

            pages.push(pageCount);
        }

        return (
            <>
            { pages.map((p,index)=>(
                typeof p ==='number'?(
                    <span
                    key={index}
                    onClick={() => handlePage(p)}
                    className={`w-[35px] h-[35px] rounded-full mx-1 text-[15px] inline-flex items-center justify-center cursor-pointer ${
                        page === p ? 'bg-[#034DB0] text-white' : ' text-[#034DB0] border border-[#034DB0] hover:bg-[#034DB0] hover:text-white'
                    }`}
                >
                    {p}
                </span>
                ):<span key={index} className="mx-1 text-[#034DB0]">...</span>
            ))
            }
            </>
        );
    };

export default RenderPageNumbers;