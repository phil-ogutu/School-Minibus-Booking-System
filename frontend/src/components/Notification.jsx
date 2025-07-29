// This is for handling the notifications
export default function Notification({ message }) {
  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded mt-4">
      {message}
    </div>
  );
}
