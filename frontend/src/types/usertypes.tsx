/**
 * @description The interface that defines all properties of a User
 * 
 * @property {string | null} email The User's email
 * @property {string | null} displayName The User's display name
 * @property {string | null} firstName The User's first name
 * @property {string | null} lastName The User's last name
 */
export interface User {
  email: string | null;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
}
