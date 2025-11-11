export interface Entity<T = string> {
  id: T;
  createdAt: Date;
  updatedAt: Date;
}
