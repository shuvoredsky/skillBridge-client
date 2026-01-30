export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
        <h3 className="text-gray-500 text-sm">Total Students</h3>
        <p className="text-2xl font-bold">1,240</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
        <h3 className="text-gray-500 text-sm">Total Tutors</h3>
        <p className="text-2xl font-bold">85</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
        <h3 className="text-gray-500 text-sm">Total Bookings</h3>
        <p className="text-2xl font-bold">450</p>
      </div>
    </div>
  );
}