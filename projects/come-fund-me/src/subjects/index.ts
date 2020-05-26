import { BehaviorSubject } from 'rxjs';
import { AUTH_STORAGE_KEY } from '../constants';
import { IProject } from '../types';

export const AUTH_SUBJECT: BehaviorSubject<any> = new BehaviorSubject(JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)));
export const PROJECTS_SUBJECT: BehaviorSubject<IProject[]> = new BehaviorSubject(null);