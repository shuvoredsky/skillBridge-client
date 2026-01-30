export default function UserDashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Upcoming Sessions</h2>
      <div className="border rounded divide-y">
        <div className="p-4 flex justify-between items-center">
          <div>
            <p className="font-medium">Mathematics - Advanced Algebra</p>
            <p className="text-sm text-gray-500">Tutor: Dr. Smith | Tomorrow at 10:00 AM</p>
          </div>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
        </div>
      </div>
    </div>
  );
}