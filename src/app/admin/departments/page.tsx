'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, PlusCircle, Trash2, Pen } from 'lucide-react';
import { departments as initialDepartments, users as initialUsers } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Department } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const getUserById = (id: string) => users.find(u => u.id === id);
  
  const handleAddDepartment = () => {
    if (newDeptName) {
      const newDepartment: Department = {
        id: `dept-${Date.now()}`,
        name: newDeptName,
        headId: '', // Head is not assigned on creation
        employeeCount: 0,
      };
      const updatedDepartments = [...departments, newDepartment];
      setDepartments(updatedDepartments);
      // Also update the global/mock data so it reflects on settings page
      initialDepartments.push(newDepartment); 
      setOpen(false);
      setNewDeptName('');
      toast({
        title: 'Department Added',
        description: `${newDepartment.name} has been created.`,
      });
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Department name is required.',
        });
    }
  };

  const handleEditClick = (department: Department) => {
    setEditingDepartment({ ...department });
    setIsEditDialogOpen(true);
  };

  const handleUpdateDepartment = () => {
    if (editingDepartment) {
      const updatedDepartments = departments.map(d => d.id === editingDepartment.id ? editingDepartment : d);
      setDepartments(updatedDepartments);

      // Also update the global/mock data
      const index = initialDepartments.findIndex(d => d.id === editingDepartment.id);
      if (index !== -1) {
        initialDepartments[index] = editingDepartment;
      }

      setIsEditDialogOpen(false);
      setEditingDepartment(null);
      toast({
        title: 'Department Updated',
        description: 'Changes have been saved successfully.',
      });
    }
  };
  
  const handleDepartmentChange = (field: keyof Department, value: string) => {
    if (editingDepartment) {
      setEditingDepartment({ ...editingDepartment, [field]: value });
    }
  }

  const handleDeleteDepartment = (departmentId: string) => {
    const updatedDepartments = departments.filter(d => d.id !== departmentId);
    setDepartments(updatedDepartments);
    
    const index = initialDepartments.findIndex(d => d.id === departmentId);
    if (index !== -1) {
      initialDepartments.splice(index, 1);
    }
    
    toast({
      title: 'Department Deleted',
      description: 'The department has been removed.',
    });
  }


  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Department Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDepartment}>Add Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
          <CardDescription>
            Organize your institution by creating and managing departments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Department Head</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => {
                const head = getUserById(department.headId);
                return (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>
                      {head ? (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={head.avatar} alt={head.name} data-ai-hint="profile person" />
                            <AvatarFallback>
                              {head.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{head.name}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>{department.employeeCount}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(department)}>
                            <Pen className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteDepartment(department.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingDepartment && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input id="edit-name" value={editingDepartment.name} onChange={(e) => handleDepartmentChange('name', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-head" className="text-right">
                  Department Head
                </Label>
                <Select onValueChange={(value) => handleDepartmentChange('headId', value)} value={editingDepartment.headId}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a head" />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateDepartment}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
