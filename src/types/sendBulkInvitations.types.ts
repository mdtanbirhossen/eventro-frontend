import { IInvitation } from "./invitation.types";

/**
 * Payload for sending invitation to single or multiple users
 * POST /events/:eventId/invite
 */
export interface ISendBulkInvitationsPayload {
  invitedUserIds: string[]; // Array of user IDs
  message?: string; // Optional personal message (same for all)
}

/**
 * Response when sending invitations
 */
export interface ISendBulkInvitationsResponse {
  successful: Array<{
    userId: string;
    invitationId: string;
    status: string;
  }>;
  failed: Array<{
    userId: string;
    reason: string;
  }>;
  summary: {
    total: number;
    successCount: number;
    failedCount: number;
  };
}

/**
 * User search result for invitation selection
 */
export interface IUserForInvitation {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

/**
 * Query params for searching users
 */
export interface ISearchUsersParams {
  search?: string;
  limit?: number;
  exclude?: string[]; // User IDs to exclude (e.g., event owner, already invited)
}