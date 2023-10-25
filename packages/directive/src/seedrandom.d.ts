declare module 'seedrandom/lib/alea' {
  export default function (str?: string): {
    double: () => number
    int32: () => number
    quick: () => number
  }
}
