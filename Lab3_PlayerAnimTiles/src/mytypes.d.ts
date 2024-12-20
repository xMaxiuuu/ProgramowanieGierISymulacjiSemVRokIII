type SkipByKeys<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type OnlyOptional<T, K extends keyof T> = Partial<Pick<T, K>> & Required<SkipByKeys<T, K>>;
type OnlyRequired<T, K extends keyof T> = Required<Pick<T, K>> & Partial<SkipByKeys<T, K>>;

// To pozniej
/*type BoundingBox = {
  xLeft: number,
  xRight: number,
  yTop: number,
  yButtom: number
};

type Segment = [number, number];
*/
