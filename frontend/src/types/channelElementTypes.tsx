/**
 * @description The interface that defines the properties of a Channel
 * 
 * @property {number} id The Channel's id
 * @property {string} name The Channel's name
 * @property {number} server The id of the Channel's parent Server
 * @property {number[]} moderators The ids of the Channel's moderators
 */
export interface Channel {
    id: number;
    name: string;
    server: number;
    moderators: number[];
}
