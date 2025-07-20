const TopSearchCard = ({pickup, dropoff, time, price }) => {
  return (
    <div className="w-full rounded-xl p-5 border-2 border-neutral-300 space-y-10">
      <div className="space-y-3.5 w-full">
        {/* Route */}
        <div className="space-y-0">
          <div className="w-full flex items-center justify-between">
            <p className="text-xs text-neutral-400 font-normal">From</p>
            <p className="text-xs text-neutral-400 font-normal">Time</p>
            <p className="text-xs text-neutral-400 font-normal">To</p>
          </div>

          <div className="w-full flex items-center justify-between gap-x-3">
            <h1 className="text-xl text-neutral-600 font-semibold">{pickup}</h1>

            <p className="">{time}</p>

            <h1 className="text-xl text-neutral-600 font-semibold">{dropoff}</h1>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between ">
        <h1 className="text-xl text-neutral-700 font-semibold">{price}</h1>

        <button className="w-fit px-5 py-1.5 h-full text-lg text-white font-light bg-yellow-500 hover:bg-yellow-600 rounded-xl">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TopSearchCard;
