// import DashboardStats, { StatItem } from "@/components/DashboardStats";
// import { adminService } from "@/services/admin.service";
// import { statisticsService } from "@/services/statistics.service";

const AdminDashboardPage = async () => {
    // const adminStats = await statisticsService.getAdminStats();
    // console.log(adminStats)
    // const stats: StatItem[] = [
    //     { title: "Total Users", value: adminStats.data?.data?.totalUsers || 0 },
    //     { title: "Total Students", value: adminStats.data?.data?.totalStudents || 0 },
    //     { title: "Total Tutors", value: adminStats.data?.data?.totalTutors || 0 },
    //     { title: "Total Admins", value: adminStats.data?.data?.totalAdmins || 0 },
    //     { title: "Total Bookings", value: adminStats.data?.data?.totalBookings || 0 },
    //     { title: "Completed Bookings", value: adminStats.data?.data?.completedBookings || 0 },
    //     { title: "Cancelled Bookings", value: adminStats.data?.data?.cancelledBookings || 0 },
    //     { title: "Confirmed Bookings", value: adminStats.data?.data?.confirmedBookings || 0 },
    //     { title: "Total Categories", value: adminStats.data?.data?.totalCategories || 0 },
    //     { title: "Total Reviews", value: adminStats.data?.data?.totalReviews || 0 },
    // ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {/* <DashboardStats stats={stats} /> */}
        </div>
    );
};

export default AdminDashboardPage;