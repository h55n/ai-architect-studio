'use client'

import { Grid } from '@react-three/drei'

interface FloorGridProps {
  visible: boolean
}

export function FloorGrid({ visible }: FloorGridProps) {
  if (!visible) return null

  return (
    <Grid
      args={[30, 30]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#C4C3E3"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#504E76"
      fadeDistance={25}
      fadeStrength={1.5}
      followCamera={false}
      infiniteGrid={false}
      position={[0, -0.01, 0]}
    />
  )
}
