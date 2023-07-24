export interface AnimationState {
  animationFrameId: number;
  id: number;
}

const getElemPosition = (elem: HTMLElement) => {
  const { top, left, width, height } = elem.getBoundingClientRect();

  return {
    x: left + width / 2,
    y: top + height / 2,
  };
};

export const getDistanceBtwElements = (
  firstElem: HTMLElement,
  secondElem: HTMLElement,
): number => {
  const firstElemPos = getElemPosition(firstElem);
  const secondElemPos = getElemPosition(secondElem);

  return Math.hypot(
    firstElemPos.x - secondElemPos.x,
    firstElemPos.y - secondElemPos.y,
  );
};

export const animateCar = async (
  car: HTMLElement,
  distanceBtwElem: number,
  animationTime: number,
): Promise<AnimationState> => {
  const targetCar = car;

  return new Promise<AnimationState>((resolve) => {
    let animationFrameId: number | null = null;
    const getStep = (timestamp: number) => {
      if (!animationFrameId) animationFrameId = timestamp;
      const time = timestamp - animationFrameId;
      const passed = Math.round(time * (distanceBtwElem / animationTime));
      targetCar.style.transform = `translateX(${Math.min(passed, distanceBtwElem)}px) translateY(52px)`;

      if (passed < distanceBtwElem) {
        animationFrameId = requestAnimationFrame(getStep);
      } else {
        resolve({ animationFrameId, id: 1 }); // Replace "1" with the appropriate ID value
      }
    };

    animationFrameId = requestAnimationFrame(getStep);
  });
};