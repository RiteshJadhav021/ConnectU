import React from 'react';

// Mock data for demonstration
const mockConnections = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

const StudentConnections = () => {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">My Connections</h2>
      {mockConnections.length === 0 ? (
        <div className="text-center text-gray-500">You have no connections yet. Start connecting with your classmates!</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {mockConnections.map(conn => (
            <li key={conn.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4">
              <div>
                <div className="font-medium text-gray-900">{conn.name}</div>
                <div className="text-sm text-gray-500">{conn.email}</div>
              </div>
              <button className="mt-2 sm:mt-0 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Message</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentConnections;
