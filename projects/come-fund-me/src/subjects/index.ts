import { BehaviorSubject } from 'rxjs';
import { AUTH_STORAGE_KEY } from '../constants';
import { IAuth } from '../types';

export const AUTH_SUBJECT: BehaviorSubject<IAuth> = new BehaviorSubject(JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)));