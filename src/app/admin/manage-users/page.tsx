"use client";

import { withAuth } from "@/components/withAuth";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "verifier";
}

function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const changeUserRole = async (userId: string, newRole: User["role"]) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        console.error("Failed to change user role");
      }
    } catch (error) {
      console.error("Error changing user role:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={(e) =>
                    changeUserRole(user._id, e.target.value as User["role"])
                  }
                  className="bg-gray-700 text-white p-1 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="verifier">Verifier</option>
                </select>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  disabled={user._id === session?.user?.id}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default withAuth(ManageUsers, ["admin"]);
