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
import { getLastChecklist, createIssue } from "../db/createchecklist"
import {z} from 'zod'
import { UserSession } from "./page"

interface Equipment {
  id: number;
  name: string;
  remarks: string;
  status: string;
  showResult: boolean
}

interface CheckListDetail{
  name: string;
  model: string;
  status: string;
  type: string;
  remarks: string;
}


const schemaChecklist = z.object(
  {
    name: z.string().min(1),
    model: z.string().optional(),
    status: z.enum(['ok', 'warning', 'critical', 'off']),
    type: z.enum(['room', 'cooling', 'power', 'server', 'switch/router']),
    remarks: z.string().max(200).optional()
  }
)

const schemaEquipments = z.object(
  {
    id: z.number(),
    name: z.string().max(100),
    remarks: z.string().max(200),
    status: z.enum(['ok', 'warning', 'critical', 'off']),
    showResult: z.boolean()
  }
)

export function SheetDemo({isOpen, setIsOpen, getChecklists, session}: {isOpen: boolean, setIsOpen: (value: boolean) => void, getChecklists: () => void, session:UserSession | {status: number}|null}) {

    const [lastChecklist, setLastChecklist] = useState<CheckListDetail[]>([]);
    const [filteredCheckList, setFilteredCheckList] = useState<CheckListDetail[]>([]);

    const [equipmentList, setEquipmentList] = useState([
        { id: 1, name: '', remarks: '', status: '', showResult: false }
      ]);
    
    const handleAddEquipment = () => {
      let newId = equipmentList.length > 0 ? Math.max(...equipmentList.map(item => item.id)) + 1 : 1;

      // Ensure the newId is unique
      while (equipmentList.some(item => item.id === newId)) {
        newId++;
      }
    
      const newEquipment = { id: newId, name: '', status: '', remarks: '', showResult: false };
      setEquipmentList([...equipmentList, newEquipment]);
    };
    
    const handleEquipmentChange = (index: number, field: keyof Equipment, value: string) => {
      const updatedEquipmentList: Equipment[] = [...equipmentList];
      updatedEquipmentList[index] = {
        ...updatedEquipmentList[index],
        [field]: value
      } as Equipment
      setEquipmentList(updatedEquipmentList);
      console.log(updatedEquipmentList)
    };

    const handleInputChange = (index: number, field: keyof Equipment, value: string) => {
      if(lastChecklist.length<1)
        getLast();

      const filteredChecklistItem = lastChecklist.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
      setFilteredCheckList(filteredChecklistItem);

      const updatedEquipmentList: Equipment[] = [...equipmentList];
      updatedEquipmentList[index] = {
        ...updatedEquipmentList[index],
        [field]: value,
        'showResult': true
      } as Equipment
        
        setEquipmentList(updatedEquipmentList);
      };

      const handleEquipmentSelect= (index: number, field: keyof Equipment, value: string) => {
        const updatedEquipmentList: Equipment[] = [...equipmentList];
        updatedEquipmentList[index] = {
          ...updatedEquipmentList[index],
          [field]: value,
          'showResult': false
        } as Equipment
        setEquipmentList(updatedEquipmentList);
      };
    
      const handleDeleteEquipment = (index: number) => {
        const updatedEquipmentList = [...equipmentList];
        updatedEquipmentList.splice(index, 1);
        setEquipmentList(updatedEquipmentList);
      };

      const handleCreateIssue = async () => {
        const updatedLastChecklist = lastChecklist.map((checklist) => {
          const equipment = equipmentList.find((item) => item.name.toLowerCase() === checklist.name.toLowerCase());
          if (equipment) {
            return {
              ...checklist,
              remarks: equipment.remarks,
              status: equipment.status,
            };
          }
          return checklist;
        });
        if(updatedLastChecklist.length>0)
        {
          setLastChecklist(updatedLastChecklist);
          await createIssue(updatedLastChecklist, session.user.userid);
          getChecklists();
          setIsOpen(false)
        }
      };

      async function getLast(){
        const data = await getLastChecklist();
        setLastChecklist(data as CheckListDetail[]);
        console.log(data)
      }
  
      return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="sm:max-w-[600px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Any issues?</SheetTitle>
              <SheetDescription>
                Create new issues and save to make changes
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">
                {equipmentList.map((equipment, equipIndex) => (
                    <div key={equipment.id} className="">
                        <div className="mt-4">
                            <Label htmlFor={`name-${equipIndex}`} className="text-left">Equipment / Device </Label>
                            <div className="flex mt-2">
                              <div>
                                <Input
                                    id={`name-${equipIndex}`}
                                    value={equipment.name}
                                    placeholder="Search for device name"
                                    autoComplete="off"
                                    className=""
                                    onChange={(e) => handleInputChange(equipIndex, 'name', e.target.value)}
                                />
                                { equipment.showResult &&
                                  <ul key={equipIndex} className="text-xs absolute bg-white shadow-lg w-2/3 mt-2 overflow-y-auto max-h-[9rem]">
                                  {
                                    filteredCheckList.length>0 ? filteredCheckList.map((item, indexx) => (
                                      <li key={indexx} onClick={() => handleEquipmentSelect(equipIndex, 'name',item.name)} 
                                      className="hover:bg-slate-50 px-2 py-2 cursor-pointer">{item.name}</li>
                                    )
                                    ): <li className="px-2 py-2">Not Found</li>
                                  }
                                </ul>
                                }
                              </div>
                                <Select defaultValue={equipment.status} onValueChange={(value) => handleEquipmentChange(equipIndex, 'status', value)}>
                                    <SelectTrigger className="w-[180px] ml-2">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="OK">OK</SelectItem>
                                        <SelectItem value="WARNING">Warning</SelectItem>
                                        <SelectItem value="CRITICAL">Critical</SelectItem>
                                        <SelectItem value="OFF">Off</SelectItem>
                                    </SelectContent>
                                </Select>
                                <button className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 ml-2 rounded" onClick={() => handleDeleteEquipment(equipIndex)}>Remove</button>
                            </div>
                            <Input
                                    id={`remarks-${equipIndex}`}
                                    value={equipment.remarks}
                                    placeholder="Enter remarks"
                                    className="mt-2"
                                    onChange={(e) => handleEquipmentChange(equipIndex, 'remarks', e.target.value)}
                                />
                        </div>
                        <div className="w-full border-b-2 mt-5 mb-5 border-slate-100"></div>
                    </div>
                ))}
                <button className="text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 mt-2" onClick={handleAddEquipment}>Add New +</button>
            </div>
            <SheetFooter>
              {/* <SheetClose asChild> */}
                <Button onClick={() => handleCreateIssue()} type="submit">Save changes</Button>
              {/* </SheetClose> */}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )
}