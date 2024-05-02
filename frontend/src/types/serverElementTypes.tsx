/**
 * @description The interface the defines the properties of a Server
 * 
 * @property {number} id - The Server's id
 * @property {string} name - The Server's name
 * @property {Object} admin - The administrator/owner of the Server
 * @property {string} admin.display_name - The display name of the administrator/owner
 * @property {number[]} users - The Server's users and contributors
 */
export interface Server {
    id: number;
    name: string;
    admin: { display_name: string };
    users: number[];
}
