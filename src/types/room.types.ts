export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  students: [];
}

export interface RoomInsertData {
  name: string;
}
