// import { useState, useEffect } from "react";

// const useFetchBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Simulating an API call with dummy data
//   useEffect(() => {
//     // Simulating delay of an API call
//     setTimeout(() => {
//       const fetchedBookings = [
//         {
//           id: 1,
//           child_name: "Ashley Moreno",
//           pickup: "Jenniferside",
//           dropoff: "Williamsonshire",
//           price: 30.02,
//           status: false,
//           created_at: "2025-03-09 00:00:00",
//           updated_at: "2025-03-05 00:00:00",
//           bus: {
//             plate: "87DK442",
//             driver: "Peter Kamau",
//           },
//           parent: {
//             username: "juan38",
//             photo_url: "https://picsum.photos/902/673",
//           },
//         },
//         {
//           id: 2,
//           child_name: "Julie Smith",
//           pickup: "Amberfort",
//           dropoff: "Lake Julie",
//           price: 45.17,
//           status: false,
//           created_at: "2025-03-24 00:00:00",
//           updated_at: "2025-01-28 00:00:00",
//           bus: {
//             plate: "87DK442",
//             driver: "Mary Otieno",
//           },
//           parent: {
//             username: "kelseysmith",
//             photo_url: "https://placekitten.com/396/4",
//           },
//         },
//         {
//           id: 3,
//           child_name: "Steven Mclaughlin",
//           pickup: "South Daniel",
//           dropoff: "South Allison",
//           price: 33.45,
//           status: true,
//           created_at: "2025-07-10 00:00:00",
//           updated_at: "2025-05-27 00:00:00",
//           bus: {
//             plate: "87DK442",
//             driver: "Peter Kamau",
//           },
//           parent: {
//             username: "robinsonkevin",
//             photo_url: "https://dummyimage.com/247x552",
//           },
//         },
//         {
//           id: 4,
//           child_name: "Christopher Pacheco",
//           pickup: "Lake Sarah",
//           dropoff: "West Sheila",
//           price: 20.6,
//           status: true,
//           created_at: "2025-03-06 00:00:00",
//           updated_at: "2025-07-04 00:00:00",
//           bus: {
//             plate: "87DK442",
//             driver: "Mary Otieno",
//           },
//           parent: {
//             username: "jhughes",
//             photo_url: "https://dummyimage.com/415x583",
//           },
//         },
//       ];

//       setBookings(fetchedBookings); // Simulating setting fetched data
//       setLoading(false);
//     }, 1000); // Simulating a 1 second delay (to mimic real API fetch)
//   }, []);

//   return { bookings, loading, error };
// };

// // export default useFetchBookings;

// import { useState, useEffect } from "react";
// // import axiosInstance from './axiosInstance';  // Importing the axiosInstance
// import axiosInstance from "@/lib/api";

// const useFetchBookings = (userId) => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch bookings from API
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await axiosInstance.get(`/users/${userId}/bookings`);  // Fetch bookings by userId
//         setBookings(response.data.bookings);  // Update state with bookings
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [userId]);  // Re-fetch if userId changes

//   return { bookings, loading, error };
// };

// export default useFetchBookings;


// Doing it from user currently:
import { useState, useEffect } from "react";
// import { useUser } from "./UserContext";  // Import the custom hook to get user context
import { useUser } from "@/context/UserContext";

const useFetchBookings = () => {
  const { user, loading, error } = useUser();  // Access user context to get user data
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    if (user && user.bookings) {
      setBookings(user.bookings);  // Directly set bookings from user context
    }
  }, [user]);  // Re-run effect when user data changes
  
  return { bookings, loading, error };
};

export default useFetchBookings;
