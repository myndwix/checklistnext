'use client';

import { ArrowLeft, LoaderCircle, SquarePen } from "lucide-react";
import Link from "next/link";
import { getUser } from "../db/getUsers";
import { EditUser } from "./_sheetedit";
import axios from "axios";
import { useEffect, useState } from "react";
import { CreateUser } from "./_sheetcreate";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";


interface SheetData{
    user: {
        userid: string | number;
        username: string;
        firstname: string;
        lastname: string;
        role: string | undefined;
        rolename: string;
    },
    isEditOpen: boolean
}

interface User{
        userid: string | number;
        username: string;
        firstname: string;
        lastname: string;
        role: string | undefined;
        rolename: string;
        password: string;
}

export default function Users(){
    const [users, setUsers] = useState<User[]>([]);
    const [sheetData, setSheeData] = useState<SheetData>({
        user: {
            userid: '',
            username: '',
            firstname: '',
            lastname: '',
            role: '',
            rolename: ''
        },
        isEditOpen: false
    });
    const [isSheetCreateOpen, setSheetCreateOpen] = useState(false);

    const [isLoading, setLoading] = useState(true);

    const handleSheeData = (user: User) => {
        setSheeData(oldData => ({user:user, isEditOpen: !oldData.isEditOpen}))
    }
    const handleCloseSheet = () => {
        setSheeData(oldData => ({...oldData, isEditOpen: !oldData.isEditOpen}))
    }
    const handleOpenSheetCreate = () => {
        setSheetCreateOpen(true);
    }
    const handleCloseSheetCreate = () => {
        setSheetCreateOpen(false);
    }

    useEffect(() => {
    axios.get('http://localhost:3000/api/users')
    .then(({data}) => {
        setUsers(data);
        setTimeout(() => setLoading(false), 200)
    })
    }, [])

    if(isLoading)
        return (<div className='w-full h-screen flex justify-center items-center'><LoaderCircle className='w-12 h-12 animate-spin'/></div>)
    else
    return(
        <div className='w-full px-5'>
            <div className="flex w-full py-4 sticky top-0 bg-white">
                <div className="flex w-full justify-space">
                    <Link href={'/checklists'}>
                        <button className='text-white text-sm rounded-full flex items-center bg-slate-100 hover:bg-slate-200 p-1'>
                            <ArrowLeft className='w-6 h-6 text-slate-800'/>
                        </button>
                    </Link>
                    <h1 className="text-xl font-semibold ml-2">Manage Users</h1>
                </div>
            </div>
        <table className="min-w-full divide-y divide-gray-300">
        <thead className="sticky top-14 bg-white">
          <tr>
            <th
              scope="col"
              className="whitespace-nowrap w-72 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              Username
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              First Name
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Last Name
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Role
            </th>
            <th>
            <button onClick={() => handleOpenSheetCreate()} className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-normal text-sm rounded transition-color duration-150">+ New User</button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user, index) => 
            <tr key={index} className='hover:bg-slate-50 group'>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-900 font-medium sm:pl-0">{user.username}</td>
              <td className="whitespace-nowrap w-80 px-2 py-2 text-sm font-medium text-gray-900">
                {user.firstname}
              </td>
              <td className="whitespace-nowrap w-80 px-2 py-2 text-sm text-gray-900">{user.lastname}</td>
              <td className="whitespace-nowrap py-2 px-2 text-sm text-gray-900 font-medium">{user.rolename}</td>
              <td>
                <span onClick={() => handleSheeData(user)} className='cursor-pointer'>
                    <SquarePen className='w-4 h-4 text-slate-600 hover:text-slate-800'/>
                </span>
              </td>
            </tr>

            )}
        </tbody>
        </table>
        <EditUser editOpen={sheetData.isEditOpen} sheetData={sheetData.user} handleCloseSheet={handleCloseSheet}/>
        <CreateUser isSheetCreateOpen={isSheetCreateOpen}  handleCloseSheetCreate={handleCloseSheetCreate}/>
        <Toaster />
      </div>
    )
}