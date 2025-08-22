import { useEffect, useState } from "react";
import useAdminStore from "../store/adminStore.js";
import useStoreStore from "../store/storeStore.js";

const Card = ({ children, className }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  />
);

const Select = (props) => (
  <select
    {...props}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  />
);

const Button = ({ children, disabled, variant = "primary", ...props }) => {
  const baseClasses =
    "w-full px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition disabled:cursor-not-allowed";
  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100",
  };
  return (
    <button
      {...props}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};

const formatStatTitle = (key) => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default function AdminDashboard() {
  const {
    dashboardStats,
    users,
    stores,
    loading,
    error,
    fetchDashboard,
    fetchUsers,
    fetchStores,
    createUser,
  } = useAdminStore();

  const { createStore } = useStoreStore();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [userError, setUserError] = useState(null);
  const [storeError, setStoreError] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);

  const [owners, setOwners] = useState([]);

  const [visibleForm, setVisibleForm] = useState(null);

  const validateUserForm = () => {
    if (newUser.name.length < 20) {
      setUserError("Name must be at least 20 characters long.");
      return false;
    }
    if (!newUser.email.includes("@")) {
      setUserError("Email must contain '@'.");
      return false;
    }
    if (newUser.password.length < 8 || newUser.password.length > 16) {
      setUserError("Password must be between 8 and 16 characters.");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(newUser.password)) {
      setUserError(
        "Password must contain at least one uppercase letter and one special character."
      );
      return false;
    }
    if (!newUser.address) {
      setUserError("Address cannot be empty.");
      return false;
    }
    setUserError(null);
    return true;
  };

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchStores();
  }, [fetchDashboard, fetchUsers, fetchStores]);

  useEffect(() => {
    setOwners(users.filter((u) => u.role === "STORE_OWNER"));
  }, [users]);

  const handleUserInput = (e) =>
    setNewUser({ ...newUser, [e.target.name]: e.target.value });

  const handleStoreInput = (e) =>
    setNewStore({ ...newStore, [e.target.name]: e.target.value });

  const handleCancelForm = () => {
    setVisibleForm(null);
    setNewUser({
      name: "",
      email: "",
      password: "",
      address: "",
      role: "USER",
    });
    setNewStore({ name: "", email: "", address: "", ownerId: "" });
    setUserError(null);
    setStoreError(null);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) return;
    setUserError(null);
    setUserLoading(true);
    try {
      await createUser(newUser);
      fetchUsers();
      handleCancelForm();
    } catch (err) {
      setUserError(err.message || "Failed to create user.");
    } finally {
      setUserLoading(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setStoreError(null);
    setStoreLoading(true);
    try {
      await createStore(newStore);
      fetchStores();
      handleCancelForm();
    } catch (err) {
      setStoreError(err.message || "Failed to create store.");
    } finally {
      setStoreLoading(false);
    }
  };

  if (loading && !dashboardStats)
    return (
      <p className="text-center text-gray-500 text-lg mt-12">
        Loading Dashboard...
      </p>
    );
  if (error) return <p className="text-center text-red-500 mt-12">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage users, stores, and view statistics.
          </p>
        </header>

        {dashboardStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(dashboardStats).map(([key, value]) => (
              <Card key={key}>
                <p className="text-sm font-medium text-gray-500">
                  {formatStatTitle(key)}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
              </Card>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <Button
              variant="primary"
              onClick={() =>
                setVisibleForm(visibleForm === "user" ? null : "user")
              }
            >
              {visibleForm === "user" ? "Close User Form" : "Add New User"}
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                setVisibleForm(visibleForm === "store" ? null : "store")
              }
            >
              {visibleForm === "store" ? "Close Store Form" : "Add New Store"}
            </Button>
          </div>

          {visibleForm === "user" && (
            <Card>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Create User
              </h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={handleUserInput}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={handleUserInput}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={handleUserInput}
                  required
                />
                <Input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={newUser.address}
                  onChange={handleUserInput}
                  required
                />
                <Select
                  name="role"
                  value={newUser.role}
                  onChange={handleUserInput}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </Select>
                {userError && (
                  <p className="text-sm text-red-600">{userError}</p>
                )}
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={userLoading}>
                    {userLoading ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {visibleForm === "store" && (
            <Card>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Create Store
              </h2>
              <form onSubmit={handleCreateStore} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Store Name"
                  value={newStore.name}
                  onChange={handleStoreInput}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Store Email"
                  value={newStore.email}
                  onChange={handleStoreInput}
                  required
                />
                <Input
                  type="text"
                  name="address"
                  placeholder="Store Address"
                  value={newStore.address}
                  onChange={handleStoreInput}
                  required
                />
                <Select
                  name="ownerId"
                  value={newStore.ownerId}
                  onChange={handleStoreInput}
                  required
                >
                  <option value="">Select Owner</option>
                  {owners.map((owner) => (
                    <option key={owner._id} value={owner._id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </Select>
                {storeError && (
                  <p className="text-sm text-red-600">{storeError}</p>
                )}
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={storeLoading}>
                    {storeLoading ? "Creating..." : "Create Store"}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Address
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3 text-gray-700">{user.name}</td>
                      <td className="p-3 text-gray-700">{user.email}</td>
                      <td className="p-3 text-gray-700">
                        {user.address || "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-red-100 text-red-800"
                              : user.role === "STORE_OWNER"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Stores</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {stores.length > 0 ? (
                  stores.map((store) => (
                    <tr
                      key={store._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3 text-gray-700">{store.name}</td>
                      <td className="p-3 text-gray-700">
                        {store.email || "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">{store.address}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      No stores found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
