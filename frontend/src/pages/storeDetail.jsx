import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useStoreStore from "../store/storeStore";
import useRatingStore from "../store/ratingStore";
import useAuthStore from "../store/authStore";

export default function StoreDetail() {
  const { id } = useParams();
  const { selectedStore, fetchStoreById } = useStoreStore();
  const { user } = useAuthStore();

  const {
    ratings,
    avgRating,
    fetchRatings,
    fetchAverageRating,
    addOrUpdateRating,
    loading,
    error,
  } = useRatingStore();

  const [userRating, setUserRating] = useState(0);

  const isOwnerOrAdmin =
    user && (user.role === "ADMIN" || user._id === selectedStore?.owner?._id);

  useEffect(() => {
    if (isOwnerOrAdmin) fetchStoreById(id);

    fetchRatings(id);
    fetchAverageRating(id);
  }, [id, isOwnerOrAdmin]);

  useEffect(() => {
    if (user && ratings.length) {
      const existing = ratings.find((r) => r.userId._id === user._id);
      if (existing) setUserRating(existing.rating);
    }
  }, [ratings, user]);

  const handleSubmitRating = async () => {
    if (!user) return alert("You must be logged in to rate!");
    await addOrUpdateRating({ storeId: id, userId: user._id, rating: userRating });
    fetchRatings(id);
    fetchAverageRating(id);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {isOwnerOrAdmin ? (
        <>
          <h1 className="text-3xl font-bold mb-2">{selectedStore?.name}</h1>
          <p>Email: {selectedStore?.email}</p>
          <p>Address: {selectedStore?.address}</p>
          <p>Owner: {selectedStore?.owner?.name} ({selectedStore?.owner?.email})</p>
          <hr className="my-4" />
        </>
      ) : (
        <p className="text-gray-700 mb-4">
          Welcome! You can rate this store below.
        </p>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-2">
          Ratings ⭐ {avgRating.toFixed(1)}
        </h2>

        <ul className="mb-4 border rounded p-2 max-h-64 overflow-y-auto">
          {ratings.map((r) => (
            <li
              key={r._id}
              className={`py-1 ${r.userId._id === user?._id ? "bg-yellow-50" : ""}`}
            >
              <strong>{r.userId?.name || "Anonymous"}:</strong> {r.rating} ⭐
              {r.userId._id === user?._id && " (You)"}
            </li>
          ))}
        </ul>

        {user && (
          <div className="flex items-center gap-2">
            <label className="font-medium">Your Rating:</label>
            <select
              value={userRating}
              onChange={(e) => setUserRating(Number(e.target.value))}
              className="border rounded p-1"
            >
              <option value={0}>Rate</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} ⭐
                </option>
              ))}
            </select>
            <button
              onClick={handleSubmitRating}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
