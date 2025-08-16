type BaseValue = {
  children: Map<string, BaseValue> | null;
  link?: never;
  [key: string]: any;
};

type LinkedValue<V extends BaseValue> = {
  [K in keyof Omit<V, "children">]: V[K];
} & {
  link: string;
  children: LinkedMap<string, V> | null;
};

type PublicValue<V extends BaseValue> = Omit<LinkedValue<V>, "link">;

/**
 * A Map-like class that automatically injects a `link` property into its values.
 * The `link` property is a string representing the dot-separated path of keys
 * leading to the item's parent. This creates a traversable hierarchy.
 *
 * @template K The key type, which must be a string.
 * @template V The value type, which must be an object with a `children` property.
 */
export class LinkedMap<K extends string, V extends BaseValue> {
  /**
   * The internal map that stores the transformed, linked values.
   * It is read-only to prevent direct manipulation from outside the class methods.
   */
  private readonly internalMap = new Map<K, LinkedValue<V>>();

  /**
   * The path of this map instance's parent. Used to construct links for items
   * added via the `set` method.
   */
  private readonly parentPath: string;

  /** A reference to the absolute root map in the hierarchy. */
  private readonly root: LinkedMap<K, V>;

  /** A reference to the immediate parent map. Null if this is the root. */
  private readonly parentMap: LinkedMap<K, V> | null;

  constructor(
    initialValues?: Map<K, V>,
    options: {
      parentPath?: string;
      root?: LinkedMap<K, V>;
      parentMap?: LinkedMap<K, V>;
    } = {}
  ) {
    this.parentPath = options.parentPath || "";
    this.root = options.root || this; // If no root is provided, this instance is the root.
    this.parentMap = options.parentMap || null;

    if (initialValues) {
      for (const [key, value] of initialValues.entries()) {
        // We delegate to the `set` method to avoid duplicating the transformation logic.
        this.set(key, value);
      }
    }
  }

  public set(key: K, value: V): this {
    if ("link" in value && value.link !== undefined) {
      throw new Error("Initial object cannot contain a 'link' property.");
    }

    const newItemsParentPath = this.parentPath
      ? `${this.parentPath}.${key}`
      : key;

    const linkedChildren = value.children
      ? new LinkedMap(value.children as Map<K, V>, {
          parentPath: newItemsParentPath,
          root: this.root,
          parentMap: this,
        })
      : null;

    const valueWithLink: LinkedValue<V> = {
      ...(value as object),
      link: this.parentPath, // The link is the path of THIS map.
      children: linkedChildren,
    } as LinkedValue<V>;

    this.internalMap.set(key, valueWithLink);
    return this;
  }

  public get(key: K): PublicValue<V> | undefined {
    const internalValue = this.internalMap.get(key);
    if (!internalValue) {
      return undefined;
    }
    const { link, ...rest } = internalValue;
    return rest;
  }

  public getWithLink(key: K): LinkedValue<V> | undefined {
    return this.internalMap.get(key);
  }

  /**
   * Gets the top-level parent key from the current map's path.
   * @returns The first key in the path, or null if the map is at the root.
   */
  public getTopParentKey(): K | null {
    if (!this.parentPath) {
      return null;
    }
    return this.parentPath.split(".")[0] as K;
  }

  /**
   * Gets the top-level parent element from the root of the hierarchy.
   * @returns The top-level parent element, or undefined if not found or at the root.
   */
  public getTopParent(): PublicValue<V> | undefined {
    const topParentKey = this.getTopParentKey();
    if (!topParentKey) {
      return undefined;
    }
    return this.root.get(topParentKey);
  }

  /**
   * Gets the immediate parent key from the current map's path.
   * @returns The last key in the path, or null if the map is at the root.
   */
  public getPreviousKey(): K | null {
    if (!this.parentPath) {
      return null;
    }
    const pathParts = this.parentPath.split(".");
    return pathParts[pathParts.length - 1] as K;
  }

  /**
   * Gets the immediate parent element from the parent map.
   * @returns The immediate parent element, or undefined if not found or at the root.
   */
  public getPrevious(): PublicValue<V> | undefined {
    const previousKey = this.getPreviousKey();
    if (!previousKey || !this.parentMap) {
      return undefined;
    }
    return this.parentMap.get(previousKey);
  }

  // --- Standard Map Methods ---

  public has(key: K): boolean {
    return this.internalMap.has(key);
  }

  public delete(key: K): boolean {
    return this.internalMap.delete(key);
  }

  public clear(): void {
    this.internalMap.clear();
  }

  public get size(): number {
    return this.internalMap.size;
  }

  public *entries(): IterableIterator<[K, PublicValue<V>]> {
    for (const [key, internalValue] of this.internalMap.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { link, ...rest } = internalValue;
      yield [key, rest];
    }
  }

  public *keys(): IterableIterator<K> {
    return this.internalMap.keys();
  }

  public *values(): IterableIterator<PublicValue<V>> {
    for (const internalValue of this.internalMap.values()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { link, ...rest } = internalValue;
      yield rest;
    }
  }

  public forEach(
    callbackfn: (value: PublicValue<V>, key: K, map: this) => void,
    thisArg?: any
  ): void {
    this.internalMap.forEach((internalValue, key) => {
      const { link, ...rest } = internalValue;
      callbackfn.call(thisArg, rest, key, this);
    });
  }
}

// --- EXAMPLE USAGE ---

// 1. Define the type for our hierarchical data.
type MyType = {
  name: string;
  children: Map<string, MyType> | null;
};

// 2. Create the initial data using standard Maps.
const myTryOutMap = new Map<string, MyType>([
  [
    "parent",
    {
      name: "someName",
      children: new Map([
        [
          "child",
          {
            name: "someOtherName",
            children: new Map([
              ["childOfChild", { name: "otherName", children: null }],
            ]),
          },
        ],
      ]),
    },
  ],
  [
    "parent2",
    {
      name: "anotherName",
      children: null,
    },
  ],
]);

// 3. Instantiate our LinkedMap.
const linkedMap = new LinkedMap<string, MyType>(myTryOutMap);
