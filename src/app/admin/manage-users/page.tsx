"use client";
import React, { useState, useEffect } from "react";
import { withAuth } from "@/components/withAuth";
import { useSession } from "next-auth/react";
import { Search, RefreshCw, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "verifier";
}

function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-br from-primary-700 to-primary-800 text-gray-100 rounded-lg shadow-xl h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Button
          onClick={fetchUsers}
          variant="secondary"
          className="flex items-center px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors duration-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 bg-primary-600 border border-primary-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all duration-300"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" />
      </div>
      <ScrollArea className="flex-grow rounded-md border border-primary-600">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-secondary-500" />
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-600 border-b border-primary-500">
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-primary-700 divide-y divide-primary-600">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-primary-600 transition-colors duration-300"
                >
                  <td className="p-3 whitespace-nowrap">{user.name}</td>
                  <td className="p-3 whitespace-nowrap">{user.email}</td>
                  <td className="p-3 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        changeUserRole(user._id, e.target.value as User["role"])
                      }
                      className="bg-primary-600 text-white p-1 rounded border border-primary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all duration-300 cursor-pointer"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="verifier">Verifier</option>
                    </select>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <Button
                      onClick={() => deleteUser(user._id)}
                      variant="destructive"
                      size="sm"
                      disabled={user._id === session?.user?.id}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ScrollArea>
      {!loading && filteredUsers.length === 0 && (
        <div className="text-center text-gray-400 mt-4 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          No users found.
        </div>
      )}
    </div>
  );
}

export default withAuth(ManageUsers, ["admin"]);
