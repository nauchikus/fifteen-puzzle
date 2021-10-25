export const PADDING_X = 48;

export const GAMEBOARD_DEFAULT_SIZE = 672;
export const MAX_SIZE = GAMEBOARD_DEFAULT_SIZE / 2;
export const RATIO = Math.min(
  MAX_SIZE + PADDING_X > innerWidth ? MAX_SIZE + PADDING_X : MAX_SIZE, innerWidth
) / MAX_SIZE / 2;

