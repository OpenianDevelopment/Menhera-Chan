import { describe, test, expect } from '@jest/globals';

describe('ES6 Module System', () => {
  test('should support modern JavaScript features', () => {
    // Test destructuring
    const { a, b } = { a: 1, b: 2 };
    expect(a).toBe(1);
    expect(b).toBe(2);

    // Test arrow functions
    const add = (x, y) => x + y;
    expect(add(2, 3)).toBe(5);

    // Test template literals
    const name = 'Menhera-Chan';
    const greeting = `Hello, ${name}!`;
    expect(greeting).toBe('Hello, Menhera-Chan!');

    // Test async/await
    const asyncFunction = async () => Promise.resolve('test');
    expect(asyncFunction()).resolves.toBe('test');
  });

  test('should support ES6 classes', () => {
    class TestClass {
      constructor(value) {
        this.value = value;
      }

      getValue() {
        return this.value;
      }
    }

    const instance = new TestClass('test');
    expect(instance.getValue()).toBe('test');
  });

  test('should support spread operator', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [...arr1, 4, 5];
    expect(arr2).toEqual([1, 2, 3, 4, 5]);

    const obj1 = { a: 1, b: 2 };
    const obj2 = { ...obj1, c: 3 };
    expect(obj2).toEqual({ a: 1, b: 2, c: 3 });
  });
});
