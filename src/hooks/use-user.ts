
"use client";

import { useState, useEffect } from 'react';
import type { UserRole } from '@/lib/types';
import { users, classes } from '@/lib/data';

export interface UserInfo {
  role: UserRole;
  email: string;
  displayName: string;
  thaiName: string;
  studentId?: string;
}

export function useUser() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      const foundUser = users.find(u => u.email === userEmail);
      if (foundUser) {
        
        const userInfo: UserInfo = {
          role: foundUser.role,
          email: foundUser.email,
          displayName: foundUser.displayName,
          thaiName: foundUser.thaiName,
          studentId: foundUser.studentId,
        };

        setUser(userInfo);
      }
    }
  }, []);

  return user;
}
