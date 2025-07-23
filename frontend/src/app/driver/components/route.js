'use client'
import { busIcon } from '@/components/ui/icons';
import Text from '@/components/ui/Text';
import { useRouter } from 'next/navigation';

export default function RouteCard({trip,index}) {
  const router = useRouter();
  return (
    <div onClick={()=>{router.push(`/driver/trip/${trip?.id}`)}} className={`bg-gradient-to-r from-[#2e2e2e] to-[#4d4d4d] text-white rounded-xl shadow-md p-4 w-full max-w-md m-1 cursor-pointer`}>
      {/* Header: Icon + Route Name + Date */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-10 rounded-full">
          {busIcon('text-dark','text-2xl')}
        </div>
        <div>
          <div className="text-lg font-medium">{`${trip?.routes?.start}-${trip?.routes?.end}` ?? 'Route Name'}</div>
          <div className="text-sm text-gray-300">{trip?.departure ?? 'date'}</div>
        </div>
      </div>

      <hr className="border-gray-400 border-opacity-30 my-2" />

      {/* Locations */}
      {trip?.routes?.locations?.length > 0 ? (
        <div className="flex justify-between items-center mt-4">
          {/* Origin */}
          <div>
            <div className="text-xl font-semibold">{trip?.routes?.locations[0]?.location_name}</div>
          </div>

          {/* Arrow */}
          <div className="text-2xl">→</div>

          {/* Destination */}
          <div className="text-right">
            <div className="text-xl font-semibold">{trip?.routes?.locations.at(-1)?.location_name}</div>
          </div>
        </div>
      ): <Text className='my-1'>No stops added</Text>}
    </div>
  );
}
