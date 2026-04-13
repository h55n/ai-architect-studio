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
  WALLS: [
    { id: 'wall-straight', label: 'Straight Wall', icon: '🧱', type: 'wall' },
    { id: 'wall-curtain', label: 'Curtain Wall', icon: '🪟', type: 'wall' },
    { id: 'wall-partition', label: 'Partition', icon: '📏', type: 'wall' },
    { id: 'wall-half', label: 'Half Wall', icon: '⬛', type: 'wall' },
    { id: 'wall-retaining', label: 'Retaining', icon: '🏗', type: 'wall' },
  ],
  OPENINGS: [
    { id: 'door-single', label: 'Single Door', icon: '🚪', type: 'door', width: 0.9, height: 2.1 },
    { id: 'door-double', label: 'Double Door', icon: '🚪', type: 'door', width: 1.6, height: 2.2 },
    { id: 'door-sliding', label: 'Sliding Door', icon: '🪟', type: 'door', width: 1.8, height: 2.1 },
    { id: 'window-small', label: 'Window S', icon: '🪟', type: 'window', width: 0.9, height: 0.9 },
    { id: 'window-large', label: 'Window L', icon: '🪟', type: 'window', width: 1.6, height: 1.2 },
    { id: 'window-floor', label: 'Floor Window', icon: '🪟', type: 'window', width: 1.4, height: 2.1 },
  ],
  FURNITURE: [
    { id: 'furn-bed-king', label: 'King Bed', icon: '🛏', type: 'furniture', furnitureType: 'bed' },
    { id: 'furn-bed-queen', label: 'Queen Bed', icon: '🛏', type: 'furniture', furnitureType: 'bed' },
    { id: 'furn-sofa', label: 'Sofa', icon: '🛋', type: 'furniture', furnitureType: 'sofa' },
    { id: 'furn-desk', label: 'Desk', icon: '🧑‍💻', type: 'furniture', furnitureType: 'desk' },
    { id: 'furn-dining-table', label: 'Dining Table', icon: '🍽', type: 'furniture', furnitureType: 'dining_table' },
    { id: 'furn-kitchen-counter', label: 'Counter', icon: '🍳', type: 'furniture', furnitureType: 'kitchen_counter' },
    { id: 'furn-bathtub', label: 'Bathtub', icon: '🛁', type: 'furniture', furnitureType: 'bathtub' },
    { id: 'furn-toilet', label: 'Toilet', icon: '🚽', type: 'furniture', furnitureType: 'toilet' },
    { id: 'furn-wardrobe', label: 'Wardrobe', icon: '🧥', type: 'furniture', furnitureType: 'wardrobe' },
    { id: 'furn-plant', label: 'Plant', icon: '🪴', type: 'furniture', furnitureType: 'plant' },
    { id: 'furn-lamp', label: 'Lamp', icon: '💡', type: 'furniture', furnitureType: 'lamp' },
    { id: 'furn-bookshelf', label: 'Bookshelf', icon: '📚', type: 'furniture', furnitureType: 'bookshelf' },
    { id: 'furn-tv-stand', label: 'TV Stand', icon: '📺', type: 'furniture', furnitureType: 'tv_stand' },
    { id: 'furn-stair', label: 'Stair', icon: '🪜', type: 'furniture', furnitureType: 'stair' },
  ],
  STRUCTURE: [
    { id: 'struct-column', label: 'Column', icon: '🗼', type: 'structure' },
    { id: 'struct-staircore', label: 'Stair Core', icon: '🪜', type: 'structure' },
    { id: 'struct-void', label: 'Atrium Void', icon: '⬜', type: 'structure' },
  ],
}

function AssetCard({ asset }: { asset: any }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${asset.id}`,
    data: {
      assetId: asset.id,
      type: asset.type,
      label: asset.label,
      furnitureType: asset.furnitureType,
      width: asset.width,
      height: asset.height,
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
