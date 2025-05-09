'use client';

import { FormEvent, useState } from 'react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Input } from './ui/input';

interface RenameDialogProps {
  documentId: Id<'documents'>;
  initialTitle: string;
  children: React.ReactNode;
}

export const RenameDialog = ({
  documentId,
  initialTitle,
  children
}: RenameDialogProps) => {
  const update = useMutation(api.documents.updateById);
  const [isUpdating, setIsUpdating] = useState(false);

  const [title, setTItle] = useState(initialTitle);
  const [open, setOpen] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    update({ id: documentId, title: title.trim() || 'Untitled' })
      .catch(() => toast.error('Something went wrong'))
      .then(() => toast.success('Document Updated'))
      .finally(() => {
        setIsUpdating(false);
        setOpen(false);
      });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogDescription>Enter a new name for this document</DialogDescription>
          </DialogHeader>
          <div className='my-4'>
            <Input
              value={title}
              onChange={e => setTItle(e.target.value)}
              placeholder='Document name'
              onClick={e => e.stopPropagation()}
            />
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='ghost'
              disabled={isUpdating}
              onClick={e => {
                e.stopPropagation();
                setOpen(false);
              }}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isUpdating}
              onClick={e => e.stopPropagation()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
