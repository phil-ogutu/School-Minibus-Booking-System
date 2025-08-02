'use client'
import { busIcon } from '@/components/ui/icons';
import Text from '@/components/ui/Text';
import { useRouter } from 'next/navigation';

export default function TripCard({trip,index}) {
  const router = useRouter();
  return (
    <div onClick={()=>{router.push(`/driver/trip/${trip?.id}`)}} className={`bg-white text-dark rounded-xl shadow-md p-4 w-full max-w-md m-1 cursor-pointer`}>
      {/* Header: Icon + Route Name + Date */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center bg-secondary bg-opacity-10 rounded-full">
          {busIcon('text-dark','text-2xl')}
        </div>
        <div>
          <div className="text-lg font-medium">{`${trip?.plate}` ?? 'Buss Plate number'}</div>
          <div className="text-sm text-gray-600">{trip?.departure ?? 'date'}</div>
          <span className={`inline-block px-3 py-1 ${trip?.status !== 'ended' ? 'bg-primary': 'bg-green-300'} text-dark rounded-full text-sm font-medium`}>
            {trip?.status}
          </span>
        </div>
      </div>

      <hr className="border-gray-400 border-opacity-30 my-2" />

      {/* Locations */}
      {trip?.routes?.locations?.length > 0 ? (
        <div className="flex justify-between items-center mt-4">
          {/* Origin */}
          <div>
            <div className="text-lg font-normal">{trip?.routes?.locations[0]?.location_name}</div>
          </div>

          {/* Arrow */}
          <div className="text-2xl">→</div>

          {/* Destination */}
          <div className="text-right">
            <div className="text-lg font-normal">{trip?.routes?.locations.at(-1)?.location_name}</div>
          </div>
        </div>
      ): <Text className='my-1'>No stops added</Text>}
    </div>
  );
}
