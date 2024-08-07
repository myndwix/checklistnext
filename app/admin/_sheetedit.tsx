import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getLastChecklist, editIssue } from "../db/createchecklist"
import {z} from 'zod'

import { ChevronRight, CircleCheck, LoaderCircle } from "lucide-react"
import { updateUser } from "../db/updateUser"
import { updatePassword } from "../db/updatePassword"
import { useToast } from "@/components/ui/use-toast"


interface Props{
  editOpen: boolean;
  handleCloseSheet: () => void;
  sheetData: {
    userid: string | number;
    username: string ;
    firstname: string;
    lastname: string;
    role: string | undefined;
    rolename: string;
  }
}

export function EditUser({editOpen, sheetData, handleCloseSheet}:Props) {

    const [username, setUsername] = useState(sheetData.username || '');
    const [firstName, setFirstName] = useState(sheetData.firstname || '');
    const [lastName, setLastName] = useState(sheetData.lastname || '');
    const [role, setRole] = useState(sheetData.rolename || '');
    const [password, setPassword] = useState('');
    const [showSecurity, setShowSecurity] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { toast } = useToast()

    const handleUserUpdate = async () => {
      const userData = {userid: sheetData.userid, username, firstname: firstName, lastname: lastName, rolename: role}
      await updateUser(userData);
      handleCloseSheet();
    }

    const handlePasswordUpdate = async () => {
      setLoading(true);
      const userData = {userid: sheetData.userid, username, password: password}
      await updatePassword(userData);
      setTimeout(() => {
        setLoading(false); 
        setPassword('');
        toast({title: "Updating password...", description: "Password has been updated!", action:(<CircleCheck/>)});
      },500)
    }
    
    useEffect(() => {
      setUsername(sheetData.username);
      setFirstName(sheetData.firstname);
      setLastName(sheetData.lastname);
      setRole(sheetData.rolename);
  }, [sheetData]);
    
      return (
        <Sheet open={editOpen} onOpenChange={handleCloseSheet}>
          <SheetContent className="sm:max-w-[600px]">
            <SheetHeader>
              <SheetTitle className="text-orange-600">Editing a user..</SheetTitle>
              <SheetDescription>
                Edit user and save to make changes
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">
                <div className="flex flex-col">
                  <div className="">
                    <Label htmlFor='username' className="text-left">Username </Label>
                    <Input
                        id='username'
                        value={username}
                        placeholder="Enter RC number"
                        autoComplete="off"
                        className=""
                        onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mt-3">
                    <Label htmlFor='username' className="text-left">First Name </Label>
                    <Input
                        id='firstname'
                        value={firstName}
                        placeholder="Enter first name"
                        autoComplete="off"
                        className=""
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="mt-3">
                    <Label htmlFor='username' className="text-left">Last Name </Label>
                    <Input
                        id='lastname'
                        value={lastName}
                        placeholder="Enter last name"
                        autoComplete="off"
                        className=""
                        onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-3">
                    <Label htmlFor='' className="text-left">Role</Label>
                    <Select defaultValue={role} onValueChange={(value) => setRole(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
            </div>
            <SheetFooter className="mt-5">
              {/* <SheetClose asChild> */}
                <Button onClick={() => handleUserUpdate()} type="submit">Save changes</Button>
              {/* </SheetClose> */}
            </SheetFooter>
            <SheetTitle onClick={() => setShowSecurity(prev => !prev)} className="mt-6 text-slate-700 flex items-center hover:text-slate-800 cursor-pointer">
              Security
              <ChevronRight className={`w-6 h-6 ${showSecurity && 'rotate-90'} transition-all duration-300`}/>
            </SheetTitle>
                <div className={`mt-3 mb-3 opacity-0 ${showSecurity ? 'opacity-100 -translate-y-0': '-translate-y-5'} transition-all duration-300 ease-out`}>
                    <Label htmlFor='password' className="text-left">New Password </Label>
                    <Input
                        id='password'
                        value={password}
                        placeholder="Enter new password or leave blank"
                        autoComplete="off"
                        className="mt-1"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                  <Button onClick={handlePasswordUpdate} className="mt-3" type="submit">
                  {isLoading && <LoaderCircle className="text-white mr-2 animate-spin"/>}
                    Update Password
                    </Button>
                  </div>
          </SheetContent>
        </Sheet>
      )
}