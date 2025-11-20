import type { MergeDeep } from 'type-fest';

declare global {
  type ExampleBaseType = {
    readonly id: string;
    readonly name: string;
  };
  type ExampleBaseTypeExtended = MergeDeep<
    ExampleBaseType,
    {
      readonly name: 'Doe' | 'John';
    }
  >;
}
