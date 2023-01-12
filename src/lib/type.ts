type InferRecursion<T, K extends string> =
    T extends object
        ? { [P in keyof T]: P extends string ? InferRecursion<T[P], `${K}.${P}`> : K }[keyof T]
        : K

export type Infer<T> =
    Extract<{ [K in keyof T]: K extends string ? InferRecursion<T[K], K> : unknown }[keyof T], string>
