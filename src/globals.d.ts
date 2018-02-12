declare module "*.scss" {
  let style: Record<string, string>;
  export = style;
}

declare module "*.svg" {
  let svg: string;
  export default svg;
}