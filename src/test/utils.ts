import { CanActivate, Type } from '@nestjs/common';

export function isGuarded(
  route: Type<unknown>,
  guardType: Type<CanActivate>
): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const guards: Type<CanActivate>[] = Reflect.getMetadata('__guards__', route);

  if (!guards) {
    throw new Error(
      'Expected: ' +
        route.name +
        ' to be protected with ' +
        guardType.name +
        '\nReceived: No guard'
    );
  }

  let foundGuard = false;
  const guardList: string[] = [];
  guards.forEach((guard: Type<CanActivate>) => {
    guardList.push(guard.name);
    if (guard === guardType) foundGuard = true;
  });

  if (!foundGuard) {
    throw new Error(
      'Expected: ' +
        route.name +
        ' to be protected with ' +
        guardType.name +
        '\nReceived: only ' +
        guardList.join(', ')
    );
  }
  return true;
}
