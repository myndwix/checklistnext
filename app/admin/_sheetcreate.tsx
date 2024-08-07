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

import { toast } from "@/components/ui/use-toast"
import { ChevronRight, CircleCheck } from "lucide-react"
import { createUser } from "../db/createUser"

interface Props{
  isSheetCreateOpen: boolean;
  handleCloseSheetCreate: () => void;
}

export function CreateUser({isSheetCreateOpen, handleCloseSheetCreate}:Props) {

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUserUpdate = async () => {
      const userData = {username, firstname: firstName, lastname: lastName, role, password, confirmpassword: confirmPassword}
      await createUser(userData);
      
      handleCloseSheetCreate();
    }
    
      return (
        <Sheet open={isSheetCreateOpen} onOpenChange={handleCloseSheetCreate}>
          <SheetContent className="sm:max-w-[600px]">
            <SheetHeader>
              <SheetTitle className="text-orange-600">Creating a user..</SheetTitle>
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
                    <Label htmlFor='password' className="text-left">Password </Label>
                    <Input
                        id='password'
                        value={password}
                        placeholder="Enter password"
                        autoComplete="off"
                        className=""
                        onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mt-3">
                    <Label htmlFor='confirmpassword' className="text-left">Confirm Password </Label>
                    <Input
                        id='confirmpassword'
                        value={confirmPassword}
                        placeholder="Enter confirm password"
                        autoComplete="off"
                        className=""
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
          
          </SheetContent>
        </Sheet>
      )
}