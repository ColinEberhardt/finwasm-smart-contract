//@nearfile
import { context, PersistentVector } from "near-runtime-ts";

let tickets = new PersistentVector<string>("m");

const TOTAL_TICKET_COUNT = 50;

export function getRemainingTicketCount(): i32 {
  return TOTAL_TICKET_COUNT - tickets.length;
}

export function hasSignedUp(): boolean {
  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i] == context.sender) {
      return true;
    }
  }
  return false;
}

export function getAttendeeList(): string {
  let attendees = "";
  for (let i = 0; i < tickets.length; i++) {
    if (attendees.length > 0) {
      attendees += ", ";
    }
    attendees += tickets[i];
  }
  return attendees;
}

export function signUp(): string {
  if (hasSignedUp()) {
    return "already_signed_up";
  }
  if (getRemainingTicketCount() === 0) {
    return "event_sold_out";
  }
  tickets.push(context.sender);
  return "success";
}
