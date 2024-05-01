/**
 * @description The interface that defines the properties of a Message
 * 
 * @property {string} text The Message body
 * @property {string} sender The display name of the User that sent the message
 * @property {string} datetime The time that the User sent the message
 */
export interface Message {
  text: string;
  sender: string;
  datetime: string;
}
