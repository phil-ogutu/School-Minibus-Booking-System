// Here is the Bookings page
import TopSearchCard from "../../components/TopSearchCard";
import SearchBus from "../../components/SearchBus";
import Navbar from "@/components/Navbar";

export default function Booking() {
  return (
    <div
      className="min-h-screen bg-[url(/bus-hero.png)] bg-no-repeat bg-center"
      style={{
        backgroundSize: "700px 400px",
        backgroundPosition: "center 30%",
      }}
    >
      <Navbar />
      <div className="text-lg text-neutral-500 font-medium flex justify-center mt-5">
        Get bus tickets
      </div>
      <h1 className="text-5xl text-neutral-700 font-semibold text-center mb-10">
        Find the Best Bus for your Child
      </h1>

      <SearchBus />

      <div className="text-center mt-100 text-3xl font-medium text-neutral-700">
        Top Search Routes
      </div>
      <div className="w-full grid grid-cols-3 gap-5 p-10">
        <TopSearchCard pickup={"Nairobi"} dropoff={"Juja"} time={"10:30pm"} price={"Ksh. 500"}/>
        <TopSearchCard pickup={"Nairobi"} dropoff={"Juja"} time={"10:30pm"} price={"Ksh. 500"}/>
        <TopSearchCard pickup={"Nairobi"} dropoff={"Juja"} time={"10:30pm"} price={"Ksh. 500"}/>
        <TopSearchCard pickup={"Nairobi"} dropoff={"Juja"} time={"10:30pm"} price={"Ksh. 500"}/>
        <TopSearchCard pickup={"Nairobi"} dropoff={"Juja"} time={"10:30pm"} price={"Ksh. 500"}/>
        <TopSearchCard pickup={"Nairobi"} dropoff={"Juja"} time={"10:30pm"} price={"Ksh. 500"}/> 
      </div>
    </div>
  );
}
