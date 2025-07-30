// components/LiveTracking/Shared/CheckpointAlert.tsx
// src/Shared/CheckpointAlert.jsx
'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function CheckpointAlert({ checkpoint, onDismiss }) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  const formatTime = (seconds) => {
    if (!seconds) return 'Calculating...'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins > 0 ? `${mins}m ` : ''}${secs}s`
  }

  return (
    <div className="relative bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg shadow-sm animate-fade-in">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
        aria-label="Dismiss alert"
      >
        <X size={18} />
      </button>
      
      <h3 className="font-bold text-lg mb-1">Checkpoint Reached</h3>
      <p className="mb-2">{checkpoint.checkpoint}</p>

      <h6 className="font-bold text-lg mb-1">Next Checkpoint</h6>
      <p className="mb-2">{checkpoint.next_checkpoint}</p>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Coordinates:</span>
          <p>{checkpoint.latitude.toFixed(6)}, {checkpoint.longitude.toFixed(6)}</p>
        </div>
        
        {checkpoint.estimated_time_to_next_checkpoint && (
          <div>
            <span className="font-medium">Next Stop In:</span>
            <p>{formatTime(checkpoint.estimated_time_to_next_checkpoint)}</p>
          </div>
        )}
        
        {checkpoint.arrived_at && (
          <div>
            <span className="font-medium">Arrived At:</span>
            <p>{new Date(checkpoint.arrived_at).toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}