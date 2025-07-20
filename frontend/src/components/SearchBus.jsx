import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const SearchBus = () => {
  return (
    <div className="w-[90%] bg-neutral-50/20 border-1 border-neutral-200 shadow-lg rounded-xl p-5 mx-auto">
        <div className="w-full flex items-center gap-5 justify-between">

            {/* From-to Section */}
            <div className="w-[60%] flex items-center gap-5 relative">

                {/* From */}
                <div className="w-1/2 h-14 border border-neutral-300 bg-white/70 font-medium flex items-center gap-1 rounded-lg p-3">
                    <div className="w-5 h-5 text-neutral-400">
                        <FaMapMarkerAlt />
                    </div>
                    <input type="text" placeholder="From..." className="flex-1 h-full border-none bg-transparent focus:outline-none"/>
                </div>

                {/* To */}
                <div className="w-1/2 h-14 border border-neutral-300 bg-white/70 font-medium flex items-center gap-1 rounded-lg p-3">
                    <div className="w-5 h-5 text-neutral-400">
                        <FaMapMarkerAlt />
                    </div>
                    <input type="text" placeholder="To..." className="flex-1 h-full border-none bg-transparent focus:outline-none"/>
                </div>
            </div>

            {/* Date section */}
            <div className="flex-1 h-14 flex items-center gap-5">

                {/* Date */}
                <div className="flex-1 h-full border border-neutral-300 bg-white/70 text-neutral-400 font-medium flex items-center gap-1 rounded-lg p-3">
                    <input type="date"  className="flex-1 h-full border-none bg-transparent focus:outline-none"/>
                </div>

                <button className="w-fit px-5 h-full text-lg text-white font-medium bg-yellow-500 hover:bg-yellow-600 rounded-xl flex items-center justify-center gap-x-2">
                    <FaSearch />
                    Search
                </button>
            </div>
        </div>
    </div>
  )
}

export default SearchBus