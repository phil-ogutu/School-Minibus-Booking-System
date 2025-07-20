import { busIcon } from '@/components/ui/icons';

export default function RouteCard({index}) {
  return (
    <div className={`bg-gradient-to-r from-[#2e2e2e] to-[#4d4d4d] text-white rounded-xl shadow-md p-4 w-full max-w-md m-1 cursor-pointer`}>
      {/* Header: Icon + Route Name + Date */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-10 rounded-full">
          {busIcon('text-dark','text-2xl')}
        </div>
        <div>
          <div className="text-lg font-medium">Route Name</div>
          <div className="text-sm text-gray-300">24, Feb 2025</div>
        </div>
      </div>

      <hr className="border-gray-400 border-opacity-30 my-2" />

      {/* Locations */}
      <div className="flex justify-between items-center mt-4">
        {/* Origin */}
        <div>
          <div className="text-xl font-semibold">Juja</div>
          <div className="text-sm text-gray-300">Gate C</div>
        </div>

        {/* Arrow */}
        <div className="text-2xl">→</div>

        {/* Destination */}
        <div className="text-right">
          <div className="text-xl font-semibold">Nairobi</div>
          <div className="text-sm text-gray-300">CBD, Koja</div>
        </div>
      </div>
    </div>
  );
}
