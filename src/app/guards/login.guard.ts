import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { jwtDecode } from 'jwt-decode';


export const loginGuard = async () => {
  const router = inject(Router);
  const { value } = await Preferences.get({ key: 'token' });

  if (value) {
    const decoded = jwtDecode(value);
    if (decoded) {
      return true;
    }
  }
  router.navigate(['login']);
  return false;
};

export const loginGuard2 = async () => {
  const router = inject(Router);
  const { value } = await Preferences.get({ key: 'token' });
  if (value) {
    const decoded = jwtDecode(value);
    if (decoded) {
      router.navigate(['tabs']);
      return false;
    }
  }
  return true;
};
