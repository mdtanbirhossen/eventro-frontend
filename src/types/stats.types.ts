 
export interface IAdminDashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalPayments: number;
  totalRevenue: string;     // Decimal sum → string
  pendingParticipants: number;
  activeEvents: number;
}