'use client';

import { useParams } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense
} from '@liveblocks/react/suspense';
import { toast } from 'sonner';

import { FullscreenLoader } from '@/components/full-screen-loader';
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from '@/constants/margins';
import { Id } from '../../../../convex/_generated/dataModel';
import { getDocuments, getUsers } from './actions';

type User = { id: string; name: string; avatar: string; color: string };

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={async () => {
        const endPoint = '/api/liveblocks-auth';
        const room = params.documentId as string;

        const response = await fetch(endPoint, {
          method: 'POST',
          body: JSON.stringify({ room })
        });
        return response.json();
      }}
      resolveUsers={({ userIds }) => {
        return userIds.map(userId => users.find(user => user.id === userId) ?? undefined);
      }}
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;
        if (text) {
          filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }
        return filteredUsers.map(user => user.id);
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const documents = await getDocuments(roomIds as Id<'documents'>[]);
        return documents.map(document => ({ id: document.id, name: document.name }));
      }}>
      <RoomProvider
        initialStorage={{
          leftMargin: LEFT_MARGIN_DEFAULT,
          rightMargin: RIGHT_MARGIN_DEFAULT
        }}
        id={`${params.documentId}`}>
        <ClientSideSuspense fallback={<FullscreenLoader label='Room loading' />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
