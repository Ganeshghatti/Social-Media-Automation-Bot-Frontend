"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { MdDeleteOutline } from "react-icons/md";

interface DeleteModalProps {
  itemName: string;
  onDelete: () => void;
  isLoading: boolean;
}

export default function DeleteModal({ itemName, onDelete, isLoading }: DeleteModalProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete();
    await setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete {itemName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {itemName}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={isLoading} onClick={handleDelete}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
