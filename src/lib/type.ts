type InferRecursion<K extends string, T> = T extends object ? { [P in keyof T]: P extends string ? InferRecursion<`${K}.${P}`, T[P]> : K }[keyof T] : K

type Infer<T> = Extract<{ [K in keyof T]: K extends string ? InferRecursion<K, T[K]> : unknown }[keyof T], string>

export default Infer
