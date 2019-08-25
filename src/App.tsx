import React, { useEffect, useState, useMemo } from 'react';
import createDeviceMotion from './motion/deviceMotion';

const App = () => {
  const [twist, setTwist] = useState(0);
  const [velocity, setVelocity] = useState([0, 0, 0]);
  const [jerk, setJerk] = useState([0, 0, 0]);
  const [acceleration, setAcceleration] = useState([0, 0, 0]);

  const rec = useMemo<Record<string, number>>(() => ({}), []);

  useEffect(() => {
    const dm = createDeviceMotion({
      direction: [0.1, 0, 1],
      elasticity: 25,
      twistCycle: 10,
      viscous: 4.5,
      weight: 1,
    });
    let orientation: EulerRotation = { alpha: 0, beta: 0, gamma: 0 };
    type Aa = ReturnType<typeof dm>;
    let aa: Aa | null = null;
    const cb = (k: string, v: number) => {
      rec[k] = v;
    };

    window.addEventListener('deviceorientation', ({ alpha, beta, gamma }) => {
      orientation = { alpha, beta, gamma };
    });
    window.addEventListener('devicemotion', ({ acceleration, rotationRate, interval }) => {
      if (!acceleration || !rotationRate) return;
      aa = dm({ acceleration, interval, orientation, rotationRate }, cb);
    });

    const update = () => {
      if (aa) {
        const { twist, velocity, acceleration, jerk } = aa;
        setTwist(twist);
        setVelocity(velocity);
        setAcceleration(acceleration);
        setJerk(jerk);
      }
      requestAnimationFrame(update);
    };
    update();
  }, [rec]);

  return (
    <div>
      <div>
        <V entries={[[`twist ${twist}`, twist / 10]]} mag={100} />
        <V entries={Object.entries(rec)} mag={1} />
        <V entries={Object.entries(velocity)} mag={50} />
        <V entries={Object.entries(acceleration)} mag={50} />
        <V entries={Object.entries(jerk)} mag={100} />
      </div>
    </div>
  );
};

const V = ({ entries, mag }: { entries: [string, number][]; mag: number }) => (
  <div>
    {entries.map(([k, v]) => (
      <>
        <div>{k}</div>
        <div
          key={k}
          style={{ width: `${Math.abs(v) * mag}px`, height: '6px', backgroundColor: v < 0 ? '#f99' : '#99f' }}
        />
      </>
    ))}
  </div>
);

export default App;
