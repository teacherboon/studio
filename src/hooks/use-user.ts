
"use client";

import { useState, useEffect } from 'react';
import type { UserRole } from '@/lib/types';
import { useData } from '@/context/data-context';

export interface UserInfo {
  userId: string;
  role: UserRole;
  email: string;
  displayName: string;
  thaiName: string;
  studentId?: string;
  homeroomClassId?: string;
}

export function useUser() {
  const { allUsers, allClasses } = useData();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      const foundUser = allUsers.find(u => u.email === userEmail);
      if (foundUser) {
        
        let homeroomClassId: string | undefined = undefined;
        if(foundUser.role === 'TEACHER') {
            const foundClass = allClasses.find(c => c.homeroomTeacherEmails?.includes(foundUser.email) && c.isActive);
            if(foundClass) {
                homeroomClassId = foundClass.classId;
            }
        }

        const userInfo: UserInfo = {
          userId: foundUser.userId,
          role: foundUser.role,
          email: foundUser.email,
          displayName: foundUser.displayName,
          thaiName: foundUser.thaiName,
          studentId: foundUser.studentId,
          homeroomClassId: homeroomClassId,
        };

        setUser(userInfo);
      }
    }
  }, [allUsers, allClasses]);

  return user;
}
