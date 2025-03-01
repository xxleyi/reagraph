import React, { FC, useMemo, useRef } from 'react';
import { useSpring, a } from '@react-spring/three';
import { animationConfig, EdgeVectors3 } from '../utils';
import { Vector3, TubeBufferGeometry, CatmullRomCurve3 } from 'three';
import { useStore } from '../store';

export interface LineProps {
  color?: string;
  size?: number;
  animated?: boolean;
  id: string;
  opacity?: number;
  points: EdgeVectors3;
}

export const Line: FC<LineProps> = ({
  color,
  id,
  size,
  opacity,
  points,
  animated
}) => {
  const tubeRef = useRef<TubeBufferGeometry | null>(null);
  const dragging = useStore(state => state.dragging);

  // Do opacity seperate from vertices for perf
  const { lineOpacity } = useSpring({
    from: {
      lineOpacity: 0
    },
    to: {
      lineOpacity: opacity
    },
    config: {
      ...animationConfig,
      duration: animated ? undefined : 0
    }
  });

  useSpring(
    () => ({
      from: {
        fromVertices: [0, 0, 0],
        toVertices: [0, 0, 0]
      },
      to: {
        fromVertices: [points.from?.x, points.from?.y, points.from?.z || 0],
        toVertices: [points.to?.x, points.to?.y, points.to?.z || 0]
      },
      onChange: event => {
        const { fromVertices, toVertices } = event.value;
        // Reference: https://bit.ly/3ORuuBP
        const t = new CatmullRomCurve3([
          new Vector3(...fromVertices),
          new Vector3(...toVertices)
        ]);

        tubeRef.current.copy(new TubeBufferGeometry(t, 20, size / 2, 5, false));
      },
      config: {
        ...animationConfig,
        duration: animated && !dragging ? undefined : 0
      }
    }),
    [animated, dragging, points, size]
  );

  const curve = useMemo(
    () => new CatmullRomCurve3([new Vector3(0, 0, 0), new Vector3(0, 0, 0)]),
    []
  );

  return (
    <mesh userData={{ id }}>
      <tubeBufferGeometry
        attach="geometry"
        args={[curve, 20, size / 2, 5, false]}
        ref={tubeRef}
      />
      <a.meshBasicMaterial
        attach="material"
        opacity={lineOpacity}
        fog={true}
        transparent={true}
        depthTest={false}
        color={color}
      />
    </mesh>
  );
};

Line.defaultProps = {
  color: '#000',
  size: 1,
  opacity: 1
};
