import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStoreStore from "../store/storeStore.js";
import useRatingStore from "../store/ratingStore.js";
import useAuthStore from "../store/authStore.js";

export default function HomePage() {
  const { stores, fetchStores, loading: loadingStores, error: storeError } = useStoreStore();
  const { user } = useAuthStore();
  const {
    addOrUpdateRating,
    fetchAverageRating,
    fetchRatings,
    avgRating: globalAvgRating,
    ratings,
    loading: ratingLoading,
    error: ratingError,
  } = useRatingStore();

  const [localRatings, setLocalRatings] = useState({}); 

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    stores.forEach((store) => {
      fetchAverageRating(store._id);
      fetchRatings(store._id).then(() => {
        if (user) {
          const existing = ratings.find((r) => r.storeId === store._id && r.userId._id === user._id);
          if (existing) setLocalRatings((prev) => ({ ...prev, [store._id]: existing.rating }));
        }
      });
    });
  }, [stores, user]);

  const handleRatingChange = async (storeId, value) => {
    if (!user) return alert("You must be logged in to rate!");
    await addOrUpdateRating({ storeId, userId: user._id, rating: value });
    setLocalRatings((prev) => ({ ...prev, [storeId]: value }));
    fetchAverageRating(storeId); 
    fetchRatings(storeId); 
  };

  if (loadingStores) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-red-200">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">{storeError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Rate the Shops
          </h1>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Be the first to add a store to our community!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store._id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to={`/store/${store._id}`} className="block">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                          {store.name}
                        </h2>
                        <div className="space-y-1">
                          <p className="text-gray-600 flex items-center text-sm">
                            <span className="mr-2">📍</span>
                            {store.address}
                          </p>
                          <p className="text-gray-500 flex items-center text-sm">
                            <span className="mr-2">👤</span>
                            {store.owner?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-lg">⭐</span>
                          <span className="font-semibold text-gray-900 ml-1">
                            {store.avgRating.toFixed(1)}
                          </span>
                        </div>
                        {localRatings[store._id] && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            Your rating: {localRatings[store._id]}⭐
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                {user && (
                  <div className="px-6 pb-6">
                    <div className="pt-3 border-t border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate this store
                      </label>
                      <select
                        value={localRatings[store._id] || 0}
                        onChange={(e) => handleRatingChange(store._id, Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm transition-all duration-200"
                      >
                        <option value={0} className="text-gray-500">Choose rating...</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} Star{n > 1 ? 's' : ''} {'⭐'.repeat(n)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {!user && (
                  <div className="px-6 pb-6">
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500 text-center">
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                          Sign in
                        </Link>{' '}
                        to rate this store
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}