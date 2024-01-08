import moment from "moment-timezone";
import { jwtDecode } from "jwt-decode";

export function convertDateToString(dateAry: Array<number>) : string {
  const date = new Date(dateAry[0], dateAry[1]-1, dateAry[2]);
  return moment(date).tz('America/Chicago').format('MM/DD/YYYY');
}

export function convertDateToMoment(dateAry: Array<number>) : moment.Moment {
  return moment(new Date(dateAry[0], dateAry[1]-1, dateAry[2]));
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// The maximum is exclusive and the minimum is inclusive
export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export const getRandomBoolean = () => {
  return getRandomInt(0, 2) === 1;
}

export function getToken(): string {
  return localStorage.getItem('token') as string;
}

export function setToken(token: string) {
  return localStorage.setItem('token', token);
}

export function clearToken() {
  return localStorage.removeItem('token');
}

export function shouldRedirect() {
  if (!getToken()) {
    return '/login';
  }
  return '';
}

export function obfuscatePhone(phone : string | undefined | null) {
  return phone && phone.length > 4 ? '*' + phone.substring(phone.length - 4) : '';
}

export function obfuscateEmail(email : string | undefined | null) {
  let obfuscatedEmail = '';
  if (email && email.indexOf('@') !== -1) {
    obfuscatedEmail = email.substring(0,1);
    obfuscatedEmail += '*';
    const indexOfAt = email.indexOf('@')
    obfuscatedEmail += email.substring(indexOfAt);
  }
  return obfuscatedEmail;
}

export function tokenExpired(token: string) {
  const nowInSeconds = Math.round(Date.now() / 1000);
  const decoded = jwtDecode(token);
  const expired = decoded.exp;
  return nowInSeconds > expired!;
}

export function prefixRoute(): string {
  return process.env.REACT_APP_ROUTING_PREFIX || '';
}