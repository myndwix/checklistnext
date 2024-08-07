'use client'

import {useEffect, useState} from 'react'
import {DateTime} from 'luxon';
import { ChevronDown, Loader2, CircleCheck, Printer, SquarePen, LogOut, User, Copy, Plus, LoaderCircle } from 'lucide-react';
import { SheetDemo } from './_sheet';
import axios from 'axios';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link'
import { EditChecklist } from './_sheetedit';
import { signOut } from "next-auth/react"
import { Session } from 'next-auth';
import Image from 'next/image'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { confirmChecklist } from '../db/createchecklist';
import { GetSession } from '../db/getSession';
import { UserProfile } from './_userprofile';
import { getUser } from '../db/getUser';


interface CheckList{
  checklistid: string;
  date: string;
  time: string;
  status: string;
  userid: string;
}

export interface CheckListDetail{
  checklistid: string;
  name: string;
  model: string;
  status: string
  type: string;
  remarks: string;
  createduser: string;
  approveduser: string;
  approveddate: string;
  signature: string;
  date: string;
}

interface SheetData{
  user: {
      userid: string | number;
      username: string;
      firstname: string;
      lastname: string;
      role: string | undefined;
      rolename: string;
      password: string;
  },
  isEditOpen: boolean
}

export interface UserSession {
  user: {
    username: string;
    lastname: string;
    role: number;
    userid: number;
    signature: string;
  }
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

export default  function Checklists() {
    const [sheetData, setSheeData] = useState<SheetData>({
        user: {
            userid: '',
            username: '',
            firstname: '',
            lastname: '',
            role: '',
            rolename: '',
            password: ''
        },
        isEditOpen: false
    });

  // UI Related
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [isCloneButtonOpen, setCloneButtonOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState({isOpen: false, checklistid: '', userid: ''});
  const [isLoading, setLoading] = useState(true);
  const { toast } = useToast()
  const [session, setSession] = useState<any>(null);

  const handleSheeData = (user: User) => {
    setSheeData(oldData => ({user:user, isEditOpen: !oldData.isEditOpen}))
}
const handleCloseSheet = () => {
    setSheeData(oldData => ({...oldData, isEditOpen: !oldData.isEditOpen}))
}



  // Backend Related
  const [checkLists, setChecLists] = useState<CheckList[]>([]);
  const [isError, setIsError] = useState('');

  // get a checklistdetail with a button click and pass to sheetedit
  const [checkListDetail, setCheckListDetail] = useState<CheckListDetail[]>([]);

  function openConfirmDialog(checklistid: string, userid: string){
    let stateData = {...isConfirmDialogOpen, isOpen: true, checklistid: checklistid, userid: userid};
    setConfirmDialogOpen(stateData);
  }

  function closeConfirmDialog(){
    let stateData = {...isConfirmDialogOpen, isOpen: false};
    setConfirmDialogOpen(stateData);
  }

  async function handleConfirmChecklist(){
    if(session && 'user' in session)
    await confirmChecklist(isConfirmDialogOpen.checklistid, session?.user?.userid);
    
    getChecklists();
    closeConfirmDialog();
    setTimeout(() => {
      toast({title: "Confirming checklist...", description: "Checklist has been confirmed!", action:(<CircleCheck/>)});
      getChecklists();
      setLoading(false);
      setCloneButtonOpen(false);
    }, 500);
  }

  function getChecklists(){
    setLoading(true);
    axios.get('/api/checklists')
    .then(({data}:any) => {setChecLists(data.recordset); setTimeout(() => setLoading(false), 200)})
    .catch((err:any) => {setIsError(err.message); setLoading(false);})
  }

  function getChecklist(checklistid: string){
    setEditOpen(true);
    setTimeout(() => {
      axios.get(`/api/checklists/${checklistid}`)
      .then(({data}:any) => {
        setCheckListDetail(data); 
      })
      .catch((err:any) => setIsError(err.message))

    },1000)
  }

  function cloneChecklist(userId: number){
    setLoading(true);
    axios.post('/api/checklists', {userid: userId})
    .then((response) => {
      setTimeout(() => {
        toast({title: "Cloning checklist", description: "Checklist has been cloned.", action:(<CircleCheck/>)});
        getChecklists();
        setLoading(false);
        setCloneButtonOpen(false);
      }, 1000);
    })
    .catch((err:any) => {
      setIsError(err.message);
      setLoading(false);
    })
  }
  const handleSession = async() => {
    const session =  await GetSession();
    if(session)
    setSession(session)
   }

   const handleGetUserProfile = async () => {
    if(session && 'user' in session){
      const user:any = await getUser(session.user.username);
      handleSheeData(user[0]);
      console.log(user)

    }
   }

   const handlePrint = (checklistid: string) => {
    axios.get(`/api/checklists/${checklistid}`)
    .then(({data}:any) => {
      setCheckListDetail(data); 
      setTimeout(() => {
        window.print();
      }, 200)
    })
    .catch((err:any) => setIsError(err.message))
   }

  useEffect(() => {
    getChecklists();
    handleSession();
  }, [])


  if(isLoading)
    return (<div className='w-full h-screen flex justify-center items-center'><LoaderCircle className='w-12 h-12 animate-spin'/></div>)
  else
  return (
      <div className='w-full px-5'>
        {/* print container start */}
        {checkListDetail&&<div className='hidden print:flex print:flex-col mx-5'>
          <div className='py-2'>
            <div>
              <h1 className='text-2xl font-semibold'>Data Center Checklist</h1>
            </div>
            <h1 className='text-lg font-semibold'>{checkListDetail[0]?.checklistid}</h1>
            <h1 className='text-lg font-semibold'>{DateTime.fromISO(checkListDetail[0]?.date).toFormat('dd/MM/yyyy')}</h1>
          </div>
          <div className='flex h-full w-full mt-5'>
            <div>
            <h1 className='text-lg font-semibold ml-1'>ROOM</h1>
              <table key='tblprint' className='w-[25rem] divide-y divide-gray-500 border border-gray-500 p-2'>
                <thead className='divide-y divide-gray-500 '>
                  <tr>
                    <th className='whitespace-nowrap px-2 py-1 text-left text-[10px] font-normal text-black font-semibold'>Name</th>
                    <th className='whitespace-nowrap px-2 py-1 text-left text-[10px] font-normal text-black font-semibold'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-500'>
                  {checkListDetail.filter(item => item.type==='room').map(checklist => 
                    <tr>
                    <td className='whitespace-nowrap text-[10px] text-black px-2'>{checklist.name}</td>
                    <td className='whitespace-nowrap text-[10px] text-black px-2 text-left'>{checklist.status}</td>
                  </tr>
                  )}
                   {checkListDetail.filter(item => item.type==='room' && item.remarks!=='').length>0 &&<tr>
                    <td colSpan={2} className='whitespace-normal text-[10px] text-black px-2'>
                      <ul className='list-disc list-inside leading-tight'>
                        {checkListDetail.filter(item => item.type==='room' && item.remarks!=='').map(item => <li><span className='font-semibold'>{item.name}</span>: {item.remarks}</li>)}
                      </ul>
                    </td>
                  </tr>}
                </tbody>
              </table>
            </div>
            <div>
            <h1 className='text-lg font-semibold ml-2'>POWER</h1>
              <table key='tblpower' className='mx-2 w-60 divide-y divide-gray-500 border border-gray-500 p-2'>
                <thead>
                  <tr>
                    <th className='whitespace-nowrap px-2 py-1 text-[10px] font-normal text-black font-semibold text-left'>Name</th>
                    <th className='whitespace-nowrap px-2 py-1 text-[10px] font-normal text-black font-semibold text-left'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-500'>
                  {checkListDetail.filter(item => item.type==='power').map(checklist => 
                    <tr>
                    <td className='whitespace-nowrap text-[10px] text-black px-2 text-left'>{checklist.name}</td>
                    <td className='whitespace-nowrap text-[10px] text-black px-2 text-left'>{checklist.status}</td>
                  </tr>
                  )}
                  {checkListDetail.filter(item => item.type==='power' && item.remarks!=='').length>0 &&<tr>
                      <td colSpan={2} className='whitespace-normal text-[10px] text-black px-2'>
                        <ul className='list-disc list-inside leading-tight'>
                          {checkListDetail.filter(item => item.type==='power' && item.remarks!=='').map(item => <li><span className='font-semibold'>{item.name}</span>: {item.remarks}</li>)}
                        </ul>
                      </td>
                    </tr>}
                </tbody>
              </table>
            </div>

            <div>
            <h1 className='text-lg font-semibold ml-1'>COOLING</h1>
              <table key='tblcooling' className='w-[25rem] divide-y divide-gray-500 border border-gray-500 p-2'>
                <thead>
                  <tr>
                    <th className='whitespace-nowrap px-2 py-1 text-left text-[10px] font-normal text-black font-semibold'>Name</th>
                    <th className='whitespace-nowrap px-2 py-1 text-left text-[10px] font-normal text-black font-semibold'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-500'>
                  {checkListDetail.filter(item => item.type==='cooling').map(checklist => 
                    <tr>
                    <td className='whitespace-nowrap text-[10px] text-black px-2'>{checklist.name}</td>
                    <td className='whitespace-nowrap text-[10px] text-black px-2'>{checklist.status}</td>
                  </tr>
                  )}
                  {checkListDetail.filter(item => item.type==='cooling' && item.remarks!=='').length>0 &&<tr>
                      <td colSpan={2} className='whitespace-normal text-[10px] text-black px-2'>
                        <ul className='list-disc list-inside leading-tight'>
                          {checkListDetail.filter(item => item.type==='cooling' && item.remarks!=='').map(item => <li><span className='font-semibold'>{item.name}</span>: {item.remarks}</li>)}
                        </ul>
                      </td>
                    </tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className='flex h-full mt-5'>
            <div className='w-full'>
              <h1 className='text-lg font-semibold ml-1'>SWITCH/ROUTER</h1>
              <table key='tblswitches' className='w-full mr-1 divide-y divide-gray-500 border border-gray-500 p-2'>
                <thead>
                  <tr>
                    <th className='whitespace-nowrap px-2 py-1 text-left text-[10px] font-normal text-black font-semibold'>Name</th>
                    <th className='whitespace-nowrap px-2 py-1 text-left text-[10px] font-normal text-black font-semibold'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-500'>
                  {checkListDetail.filter(item => item.type==='switch/router').map(checklist => 
                    <tr>
                    <td className='whitespace-nowrap text-[10px] text-black px-2'>{checklist.name}</td>
                    <td className='whitespace-nowrap text-[10px] text-black px-2'>{checklist.status}</td>
                  </tr>
                  )}
                  {checkListDetail.filter(item => item.type==='switch/router' && item.remarks!=='').length>0 &&<tr>
                      <td className='whitespace-normal text-[10px] text-black px-2'>
                        <ul className='list-disc list-inside leading-tight'>
                          {checkListDetail.filter(item => item.type==='switch/router' && item.remarks!=='').map(item => <li><span className='font-semibold'>{item.name}</span>: {item.remarks}</li>)}
                        </ul>
                      </td>
                    </tr>}
                </tbody>
              </table>
            </div>
      
            <div className='w-full'>
              <h1 className='text-lg font-semibold ml-1'>SERVERS</h1>
              <table key='tblservers' className='w-full ml-1 divide-y divide-gray-500 border border-gray-500 p-2'>
                <thead>
                  <tr>
                    <th className='whitespace-nowrap px-2 py-1 text-left text-[10px] font-normal text-black font-semibold'>Name</th>
                    <th className='whitespace-nowrap px-2 py-1 text-left text-[10px] font-normal text-black font-semibold'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-500'>
                  {checkListDetail.filter(item => item.type==='server').map(checklist => 
                    <tr>
                    <td className='whitespace-nowrap text-[10px] text-black px-2'>{checklist.name}</td>
                    <td className='whitespace-nowrap text-[10px] text-black px-2'>{checklist.status}</td>
                  </tr>
                  )}
                  {checkListDetail.filter(item => item.type==='server' && item.remarks!=='').length>0 &&<tr>
                      <td colSpan={2} className='whitespace-normal text-[10px] text-black px-2'>
                        <ul className='list-disc list-inside leading-tight'>
                          {checkListDetail.filter(item => item.type==='server' && item.remarks!=='').map(item => <li><span className='font-semibold'>{item.name}</span>: {item.remarks}</li>)}
                        </ul>
                      </td>
                    </tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className='hidden print:flex mt-16'>
          <table key='tblsignature' className='w-full divide-y divide-gray-500 border border-gray-500 p-2'>
                <thead>
                  <tr>
                    <th className='w-1/4 whitespace-nowrap px-2 py-1 text-left text-[12px] font-normal text-black font-semibold'>Created by</th>
                    <th className='w-1/4 whitespace-nowrap px-2 py-1 text-left text-[12px] font-normal text-black font-semibold'>Reviewed by</th>
                    <th className='w-1/3 whitespace-nowrap px-2 py-1 text-left text-[12px] font-normal text-black font-semibold'>Signature</th>
                    <th className='w-1/3 whitespace-nowrap px-2 py-1 text-left text-[12px] font-normal text-black font-semibold'>Date</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-500'>
                    <tr>
                    <td className='whitespace-nowrap text-[12px] text-black px-2 py-10'>{checkListDetail[0]?.createduser}</td>
                    <td className='whitespace-nowrap text-[12px] text-black px-2 py-10'>{checkListDetail[0]?.approveduser}</td>
                    <td className='whitespace-nowrap text-[12px] text-black px-2 py-10'>

                    <Image src={`/${checkListDetail[0]?.signature}`} alt='sameensign' width="133" height="400" />
                    </td>
                    <td className='whitespace-nowrap text-[10px] text-black px-2 py-10'>{DateTime.fromISO(checkListDetail[0]?.approveddate).toFormat('dd/MM/yyyy')}</td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>}
        {/* print container end */}


          <div className='w-full px-5 print:hidden'>
            <table className="min-w-full divide-y divide-gray-300">
            <thead className='sticky top-0 overflow-y-auto z-50 bg-white'>
              <tr>
                <th
                  scope="col"
                  className="whitespace-nowrap w-72 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Checklist No
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th className='whitespace-wrap px-2 py-3.5'>
                  <div className='flex items-center justify-end'>
                    {session?.user?.role===1 && <div className='relative flex'>
                      <button onClick={() => {setIsOpen(true); }} className='px-2 py-1 bg-blue-500 text-xs font-normal text-white rounded-l hover:bg-blue-600 transition-color duration-150'>New</button>
                      <DropdownMenu>
                        <DropdownMenuTrigger className='flex outline-none border-none'>
                        <span onClick={() => setCloneButtonOpen(!isCloneButtonOpen)} className='px-2 py-1 bg-blue-500 text-xs font-normal text-white rounded-r hover:bg-blue-600 transition-color duration-150 border-l border-blue-600'><ChevronDown className='w-4 h-full'/></span>
                        
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-44'>
                          <DropdownMenuLabel className='text-xs font-medium text-slate-500'>Clone the most recent status...
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className='text-blue-600 hover:text-blue-800' style={{color: 'blue'}} onClick={() => cloneChecklist(session.user.userid)}>
                            <Copy className='group-hover:flex w-4 h-4 text-blue-600 hover:text-blue-800 mr-2'/>
                            Clone
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>}

                    <div className='flex items-center cursor-pointer text-slate-700 hover:text-slate-800'>
                      <DropdownMenu>
                        <DropdownMenuTrigger className='flex outline-none border-none'>
                          <p className='ml-3 text-sm font-semi-bold'>{session?.user?.lastname}</p>
                          <ChevronDown className='w-5'/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleGetUserProfile()}>
                            <User className='group-hover:flex w-4 h-4 text-slate-600 hover:text-slate-800 mr-2'/>
                            Profile
                          </DropdownMenuItem>
                          {session?.user?.role===1 && <>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Manage</DropdownMenuLabel>
                          
                          <DropdownMenuSeparator />
                          <Link href={'/admin'}>
                          <DropdownMenuItem>
                            <User className='group-hover:flex w-4 h-4 text-slate-600 hover:text-slate-800 mr-2'/>
                            Users
                          </DropdownMenuItem>
                          </Link>
                          </>}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut className='group-hover:flex w-4 h-4 text-slate-600 hover:text-slate-800 mr-2'/>
                            Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {checkLists.map((list) => (
                <tr key={list.checklistid} className='hover:bg-slate-50 hover:shadow-md transition-all duration-150 group even:bg-slate-100'>
                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-900 font-medium sm:pl-0">{list.checklistid}</td>
                  <td className="whitespace-nowrap w-80 px-2 py-2 text-sm font-medium text-gray-900">
                    {DateTime.fromISO(list.date).toFormat('dd/MM/yyyy')}
                  </td>
                  <td className="whitespace-nowrap w-80 px-2 py-2 text-sm text-gray-900">{DateTime.fromISO(list.time, {zone: 'UTC'}).toFormat('HH:mm')}</td>
                  <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-left text-sm font-medium sm:pr-0 flex items-center">
                    <Link href={`/checklists/${list.checklistid}`}>
                      <span className={` px-2 py-1 cursor-pointer transition-colors duration-150 ${list.status ? 'bg-green-200 text-green-900 hover:bg-green-300' : 'bg-orange-200 text-neutral-900 hover:bg-orange-300'}`}>
                        {list.status ? 'Approved' : 'Pending..'}
                      </span>
                    </Link>
                    {list.status ? <span onClick={() => handlePrint(list.checklistid)} className='ml-2 px-2 rounded cursor-pointer'>
                      <Printer className='w-4 h-4 text-slate-600 hover:text-slate-800'/>
                      </span>:
                    <div className='flex group'>
                      {session?.user.role===1 ? <div className='flex'>
                        <span onClick={() => getChecklist(list.checklistid)} className='hidden group-hover:flex ml-2 p-1 rounded cursor-pointer bg-slate-200 h-full'>
                          <SquarePen className=' w-4 h-4 text-slate-600 hover:text-slate-800'/>
                        </span>
                        <span onClick={() => openConfirmDialog(list.checklistid, session?.user?.userid)} className='ml-2 p-1 rounded cursor-pointer bg-slate-100 h-full flex hidden group-hover:flex hover:bg-slate-200'>
                          <CircleCheck className='hidden group-hover:flex w-4 h-4 text-slate-600 hover:text-slate-800'/>
                        </span>
                      </div>:
                        <span onClick={() => openConfirmDialog(list.checklistid, list.userid)} className='ml-2 p-1 rounded cursor-pointer bg-slate-100 h-full flex hidden group-hover:flex hover:bg-slate-200'>
                        <CircleCheck className='hidden group-hover:flex w-4 h-4 text-slate-600 hover:text-slate-800'/>
                      </span>
                      }
                      </div>
                    }
                    
                  </td>
                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-900 font-medium sm:pl-0"></td>
                </tr>
              ))}
            </tbody>
            </table>
              <SheetDemo session={session} getChecklists={getChecklists} isOpen={isOpen} setIsOpen={setIsOpen}/>
              <EditChecklist getChecklists={getChecklists} editOpen={editOpen} setEditOpen={setEditOpen} checkListDetail={checkListDetail}/>
              <UserProfile session={session} editOpen={sheetData.isEditOpen} sheetData={sheetData.user} handleCloseSheet={handleCloseSheet} />
              <AlertDialog open={isConfirmDialogOpen.isOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={closeConfirmDialog}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleConfirmChecklist}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              <Toaster />
          </div>
      </div>
  );
}
