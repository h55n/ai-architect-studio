# Data Models — AI Architect Studio

## TypeScript Interfaces

### UserProfile
```typescript
interface UserProfile {
  lifestyle: string;           // e.g. "remote worker, minimalist"
  household: {
    adults: number;
    children: number;
    pets: boolean;
  };
  budget: 'low' | 'medium' | 'high' | 'luxury';
  style: string[];             // e.g. ["modernist", "japandi"]
  rooms: RoomRequirement[];
  priorities: string[];        // top 3 design priorities
  climate?: string;            // optional climate zone
  specialNeeds?: string;       // accessibility or functional notes
}

interface RoomRequirement {
  type: string;                // e.g. "bedroom", "kitchen"
  count: number;
  sizeTier: 'small' | 'medium' | 'large';
  notes?: string;
}
```

### DesignSpec
```typescript
interface DesignSpec {
  id: string;                  // UUID — stable across UPDATE calls
  version: number;             // increments on each UPDATE
  style: string;               // e.g. "Japandi Townhouse"
  floors: Floor[];
  exteriorMaterial: string;    // e.g. "white render + timber accents"
  roofType: 'flat' | 'gabled' | 'monopitch' | 'shed' | 'butterfly';
  totalArea: number;           // square meters
  generatedAt: string;         // ISO 8601 timestamp
}

interface Floor {
  level: number;               // 0 = ground, 1 = first floor
  height: number;              // ceiling height in meters (typically 2.7–3.5)
  rooms: Room3D[];
}

interface Room3D {
  id: string;                  // UUID — stable across UPDATEs
  type: string;                // functional type: "bedroom", "kitchen"
  label: string;               // display label: "Master Bedroom"
  position: { x: number; y: number; z: number };
  dimensions: { w: number; h: number; d: number };  // meters
  material: 'concrete' | 'timber' | 'brick';
  color: string;               // hex from palette
  connections?: string[];      // IDs of adjacent rooms (doors)
  furniture?: FurnitureItem[];
}

interface FurnitureItem {
  id: string;
  type: string;                // e.g. "bed", "sofa", "desk"
  position: { x: number; y: number; z: number };   // room-relative
  dimensions: { w: number; h: number; d: number };
}
```

### Viewer State
```typescript
interface ViewerState {
  exploded: boolean;
  xrayLevel: number;           // 0 = off, 1 = full cutaway
  materialPreset: 'concrete' | 'timber' | 'brick';
  viewMode: '3d' | '2d';
}
```

## Sample DesignSpec JSON
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "version": 1,
  "style": "Japandi Modernist",
  "exteriorMaterial": "white render with exposed timber beams",
  "roofType": "flat",
  "totalArea": 185,
  "generatedAt": "2025-04-12T09:30:00Z",
  "floors": [
    {
      "level": 0,
      "height": 3.0,
      "rooms": [
        {
          "id": "r001",
          "type": "living_room",
          "label": "Living Room",
          "position": { "x": 0, "y": 0, "z": 0 },
          "dimensions": { "w": 6, "h": 3.0, "d": 5 },
          "material": "concrete",
          "color": "#FDF8E2",
          "connections": ["r002", "r003"],
          "furniture": []
        },
        {
          "id": "r002",
          "type": "kitchen",
          "label": "Kitchen",
          "position": { "x": 7, "y": 0, "z": 0 },
          "dimensions": { "w": 4, "h": 3.0, "d": 5 },
          "material": "timber",
          "color": "#A3B565",
          "connections": ["r001"],
          "furniture": []
        }
      ]
    },
    {
      "level": 1,
      "height": 3.0,
      "rooms": [
        {
          "id": "r003",
          "type": "bedroom",
          "label": "Master Bedroom",
          "position": { "x": 0, "y": 3.0, "z": 0 },
          "dimensions": { "w": 5, "h": 3.0, "d": 4 },
          "material": "timber",
          "color": "#C4C3E3",
          "connections": ["r004"],
          "furniture": []
        }
      ]
    }
  ]
}
```
