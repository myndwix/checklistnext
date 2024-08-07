'use client'

import axios from 'axios';
import { ChevronDown, Divide, LoaderCircle, ArrowLeft } from 'lucide-react';
import React from 'react';
import {useEffect, useState} from 'react'
import {
Tooltip,
TooltipContent,
TooltipProvider,
TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link';


interface CheckList{
checklistid: string;
name: string;
model: string;
status: string;
type: string;
remarks: string;
}

export default function Checklist({params}: {params: {id: string}}) {
    const [checkList, setCheckList] = useState<CheckList[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setIsError] = useState('');

    useEffect(() => {
        getChecklist(params.id);
    }, []);


    function getChecklist(id: string){
        setLoading(true);
        axios.get(`/api/checklists/${id}`)
        .then(({data}:any) => {setCheckList(data);  setTimeout(() => setLoading(false), 200)})
        .catch((err:any) => {setIsError(err.message); setLoading(false)})
      }

    
if(isLoading)
    return (<div className='w-full h-screen flex justify-center items-center'><LoaderCircle className='w-12 h-12 animate-spin'/></div>)
else
return (
        <div className='fixed inset-0 flex flex-col'>
            {/* starting of header */}
            <div className='bg-white shadow-md mb-2 h-11 flex items-center px-2'>
                <Link href={'/checklists'}><button className='text-white text-sm rounded-full flex items-center bg-slate-100 hover:bg-slate-200 p-1'>
                    <ArrowLeft className='w-6 h-6 text-slate-800'/>
                </button></Link>
                <h1 className='text-lg font-medium ml-3'>{checkList[0].checklistid}</h1>
            </div>
            {/* end of header */}

            <div className='grid col-span-2 h-1/4 px-2'>
                <div className='grid col-span-2 grid-cols-3 gap-1'>
                    <div className='px-2 w-full border border-black overflow-x-auto'>
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                    scope="col"
                                    className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-0"
                                    >
                                    Name
                                    </th>
                                    <th
                                    scope="col"
                                    className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-900"
                                    >
                                    Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {checkList.filter(e => e.type==='room').map((list, index) => (
                                <tr key={index} className='hover:bg-yellow-50 even:bg-slate-100'>
                                <td className="whitespace-nowrap py-2 pr-3 text-xs text-slate-900 sm:pl-0 font-semibold">{list.name}</td>
                                {/* <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs text-slate-900 sm:pl-0 font-semibold">{list.model}</td> */}
                                <td className="relative whitespace-nowrap py-2 pr-4 text-left text-xs font-semibold sm:pr-0">
                                <TooltipProvider>
                                        <Tooltip delayDuration={300}>
                                        <TooltipTrigger>
                                            <span  className={`px-2 py-1 cursor-pointer transition-colors duration-150 text-xs 
                                                ${list.status === 'OK' ? 'bg-green-200 text-green-900 hover:bg-green-300' 
                                                : list.status === 'WARNING' ? 'bg-orange-200 text-neutral-900 hover:bg-orange-300'
                                                : list.status === 'OFF' ? 'bg-gray-300 text-neutral-900'
                                                : 'bg-red-200 text-neutral-900 hover:bg-red-300'}`}>
                                            {list.status}
                                            </span>
                                        </TooltipTrigger>
                                            {list.remarks.length>0 && <TooltipContent>
                                                <p>{list.remarks}</p>
                                            </TooltipContent>}
                                        </Tooltip>
                                    </TooltipProvider>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='px-2 w-full border border-black overflow-x-auto'>
                    <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                            <th
                            scope="col"
                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-0"
                            >
                            Name
                            </th>
                            <th
                            scope="col"
                            className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-900"
                            >
                            Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {checkList.filter(e => e.type === 'cooling').map((list, index) => (
                           <tr key={index} className='hover:bg-yellow-50 even:bg-slate-100'>
                           <td className="whitespace-nowrap py-2 pr-3 text-xs text-slate-900 sm:pl-0 font-semibold">{list.name}</td>
                           {/* <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs text-slate-900 sm:pl-0 font-semibold">{list.model}</td> */}
                           <td className="relative whitespace-nowrap py-2 pr-4 text-left text-xs font-semibold sm:pr-0">
                           <TooltipProvider>
                                   <Tooltip delayDuration={300}>
                                   <TooltipTrigger>
                                       <span  className={`px-2 py-1 cursor-pointer transition-colors duration-150 text-xs 
                                           ${list.status === 'OK' ? 'bg-green-200 text-green-900 hover:bg-green-300' 
                                           : list.status === 'WARNING' ? 'bg-orange-200 text-neutral-900 hover:bg-orange-300'
                                           : list.status === 'OFF' ? 'bg-gray-300 text-neutral-900'
                                           : 'bg-red-200 text-neutral-900 hover:bg-red-300'}`}>
                                       {list.status}
                                       </span>
                                   </TooltipTrigger>
                                       {list.remarks.length>0 && <TooltipContent>
                                           <p>{list.remarks}</p>
                                       </TooltipContent>}
                                   </Tooltip>
                               </TooltipProvider>
                           </td>
                           </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                    <div className='px-2 w-full border border-black overflow-x-auto'>
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                    scope="col"
                                    className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-0"
                                    >
                                    Name
                                    </th>
                                    <th
                                    scope="col"
                                    className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-900 hidden md:flex"
                                    >
                                    Model
                                    </th>
                                    <th
                                    scope="col"
                                    className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-900"
                                    >
                                    Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {checkList.filter(e => e.type==='power').map((list, index) => (
                                <tr key={index} className='hover:bg-slate-50 even:bg-slate-100'>
                                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs text-slate-800 sm:pl-0 font-semibold">{list.name}</td>
                                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs text-slate-800 sm:pl-0 font-semibold hidden md:flex">{list.model}</td>
                                <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-left text-xs font-medium sm:pr-0">
                                    <TooltipProvider>
                                        <Tooltip delayDuration={300}>
                                        <TooltipTrigger>
                                            <span  className={`px-2 py-1 cursor-pointer transition-colors duration-150 text-xs 
                                                ${list.status === 'OK' ? 'bg-green-200 text-green-900 hover:bg-green-300' 
                                                : list.status === 'WARNING' ? 'bg-orange-200 text-neutral-900 hover:bg-orange-300'
                                                : list.status === 'OFF' ? 'bg-gray-300 text-neutral-900'
                                                : 'bg-red-200 text-neutral-900 hover:bg-red-300'}`}>
                                            {list.status}
                                            </span>
                                        </TooltipTrigger>
                                            {list.remarks.length>0 && <TooltipContent>
                                                <p>{list.remarks}</p>
                                            </TooltipContent>}
                                        </Tooltip>
                                    </TooltipProvider>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            

            <div className='px-2 overflow-y-auto flex flex-1 gap-1 mt-1 mb-2'>
                <div className='px-2 h-full border border-black w-full overflow-y-auto'>
                    <table className="w-full divide-y divide-gray-300">
                        <thead className='sticky top-0 bg-slate-50 z-50'>
                        <tr>
                            <th
                            scope="col"
                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-0"
                            >
                            Name
                            </th>
                            <th
                            scope="col"
                            className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-900 hidden md:flex"
                            >
                            Model
                            </th>
                    
                            <th
                            scope="col"
                            className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-900"
                            >
                            Status
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {checkList.filter(e => e.type ==='switch/router').map((list, index) => (
                            <tr key={index} className='hover:bg-slate-50 even:bg-slate-100'>
                                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs text-slate-800 sm:pl-0 font-semibold">{list.name}</td>
                                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs text-slate-800 sm:pl-0 font-medium hidden md:flex">{list.model}</td>
                                <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-left text-xs font-semibold sm:pr-0">
                                <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                            <TooltipTrigger>
                                                <span  className={`px-2 py-1 cursor-pointer transition-colors duration-150 text-xs 
                                                    ${list.status === 'OK' ? 'bg-green-200 text-green-900 hover:bg-green-300' 
                                                    : list.status === 'WARNING' ? 'bg-orange-200 text-neutral-900 hover:bg-orange-300'
                                                    : list.status === 'OFF' ? 'bg-gray-300 text-neutral-900'
                                                    : 'bg-red-200 text-neutral-900 hover:bg-red-300'}`}>
                                                {list.status}
                                                </span>
                                            </TooltipTrigger>
                                                {list.remarks.length>0 && <TooltipContent>
                                                    <p>{list.remarks}</p>
                                                </TooltipContent>}
                                            </Tooltip>
                                        </TooltipProvider>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                

                <div className='h-full overflow-y-auto w-full'>
                    <div className='px-2 w-full h-full overflow-y-auto border border-black'>
                        <table className="w-full divide-y divide-gray-300">
                            <thead className='sticky top-0 bg-slate-50 z-50'>
                            <tr>
                                <th
                                scope="col"
                                className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-0"
                                >
                                Name
                                </th>
                                <th
                                scope="col"
                                className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-900 hidden md:flex"
                                >
                                Model
                                </th>
                        
                                <th
                                scope="col"
                                className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-900"
                                >
                                Status
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {checkList.filter(e => e.type ==='server').map((list, index) => (
                                    <tr key={index} className='hover:bg-slate-50 even:bg-slate-100'>
                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs text-slate-800 sm:pl-0 font-semibold">{list.name}</td>
                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs text-slate-800 sm:pl-0 font-medium hidden md:flex">{list.model}</td>
                                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-left text-xs font-semibold sm:pr-0">
                                    <TooltipProvider>
                                        <Tooltip delayDuration={300}>
                                        <TooltipTrigger>
                                            <span  className={`px-2 py-1 cursor-pointer transition-colors duration-150 text-xs 
                                                ${list.status === 'OK' ? 'bg-green-200 text-green-900 hover:bg-green-300' 
                                                : list.status === 'WARNING' ? 'bg-orange-200 text-neutral-900 hover:bg-orange-300'
                                                : list.status === 'OFF' ? 'bg-gray-600 text-white'
                                                : 'bg-red-200 text-neutral-900 hover:bg-red-300'}`}>
                                            {list.status}
                                            </span>
                                        </TooltipTrigger>
                                            {list.remarks.length>0 && <TooltipContent>
                                                <p>{list.remarks}</p>
                                            </TooltipContent>}
                                        </Tooltip>
                                    </TooltipProvider>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
  );

}
