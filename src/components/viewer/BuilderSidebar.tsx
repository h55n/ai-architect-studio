import React, { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const ASSET_CATEGORIES = {
  ROOMS: [
    { id: 'room-bedroom', label: 'Bedroom', icon: '🛏', type: 'bedroom', defaultDimensions: { width: 4, height: 3, depth: 4 } },
    { id: 'room-living', label: 'Living Room', icon: '🛋', type: 'living', defaultDimensions: { width: 5, height: 3, depth: 6 } },
    { id: 'room-kitchen', label: 'Kitchen', icon: '🍳', type: 'kitchen', defaultDimensions: { width: 4, height: 3, depth: 3.5 } },
    { id: 'room-bathroom', label: 'Bathroom', icon: '🚿', type: 'bathroom', defaultDimensions: { width: 2.5, height: 3, depth: 2.5 } },
    { id: 'room-office', label: 'Office', icon: '💻', type: 'office', defaultDimensions: { width: 3, height: 3, depth: 3 } },
    { id: 'room-dining', label: 'Dining', icon: '🪑', type: 'dining', defaultDimensions: { width: 4, height: 3, depth: 4 } },
    { id: 'room-garage', label: 'Garage', icon: '🚗', type: 'garage', defaultDimensions: { width: 6, height: 3, depth: 6 } },
    { id: 'room-hallway', label: 'Hallway', icon: '🚪', type: 'hallway', defaultDimensions: { width: 1.5, height: 3, depth: 4 } },
  ],
  FURNITURE: [
    { id: 'furn-bed-king', label: 'King Bed', type: 'furniture' },
    { id: 'furn-sofa', label: 'Sofa', type: 'furniture' },
    { id: 'furn-desk', label: 'Desk', type: 'furniture' },
  ],
  OPENINGS: [
    { id: 'door-single', label: 'Single Door', type: 'door' },
    { id: 'window-small', label: 'Window S', type: 'window' },
    { id: 'window-large', label: 'Window L', type: 'window' },
  ]
}

function AssetCard({ asset }: { asset: any }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${asset.id}`,
    data: {
      assetId: asset.id,
      type: asset.type,
      defaultDimensions: asset.defaultDimensions,
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-surface-2 border border-border rounded-xl h-[90px] flex flex-col items-center justify-center cursor-grab hover:border-accent hover:bg-accent-soft transition-all"
      style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 100 } : undefined}
    >
      <div className="text-2xl mb-1 pointer-events-none">{asset.icon || '📦'}</div>
      <div className="font-mono text-[10px] text-text-secondary text-center pointer-events-none w-full px-1 truncate">
        {asset.label}
      </div>
    </div>
  )
}

export function BuilderSidebar() {
  const [search, setSearch] = useState('')

  return (
    <div className="w-[240px] h-full bg-surface border-r border-border flex flex-col overflow-hidden fixed left-0 top-0 z-40">
      {/* Search */}
      <div className="p-4 border-b border-border bg-surface sticky top-0 z-10">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {Object.entries(ASSET_CATEGORIES).map(([category, items]) => {
          const filtered = items.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
          if (filtered.length === 0) return null

          return (
            <div key={category}>
              <h3 className="font-mono text-[9px] uppercase tracking-widest text-text-muted mb-3 sticky top-0 bg-surface py-1">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {filtered.map((item) => (
                  <AssetCard key={item.id} asset={item} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
