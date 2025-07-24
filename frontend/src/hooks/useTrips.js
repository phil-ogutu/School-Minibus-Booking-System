import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export function useTrips() {
  const { data, error, mutate } = useSWR("/api/trips", fetcher);

  const createTrip = async (tripData) => {
    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tripData),
    });
    if (!res.ok) throw new Error("Failed to create trip");
    mutate(); // refresh data
  };

  const deleteTrip = async (id) => {
    const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete trip");
    mutate(); // refresh data
  };

  return {
    trips: data || [],
    isLoading: !error && !data,
    isError: error,
    createTrip,
    deleteTrip,
  };
}
