export interface IEventCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/** POST /events/admin/categories */
export interface ICreateCategoryPayload {
  name: string;
  description?: string;
}
 
/** PATCH /event-categories/:id */
export interface IUpdateCategoryPayload {
  name?: string;
  description?: string;
}
 