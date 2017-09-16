
// 0, o, 1, l omitted (leaving 32 (2^5) symbols, hmmm...)
const DEFAULT_CHARS = [
  'a','b','c','d','e','f','g','h','i','j','k','m','n','p','q','r','s','t','u','v','w','x','y','z',
  '2','3','4','5','6','7','8','9',
];

function randomizer(charList: string[] = DEFAULT_CHARS): any {
  return {
    [Symbol.iterator]() {
      return {
        next: function() {
          return {
            value: charList[Math.floor(Math.random() * charList.length)],
            done: false,
          };
        },
      }
    },
  }
}

export function newId(size?: number, charList?: string[]) {
  let result = '';
  let it = randomizer(charList)[Symbol.iterator]();

  size = size || 10;

  while(result.length <= size) {
    result += it.next().value;
  }

  return result;
}


// export default {
//   newId,
// }