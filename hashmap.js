//============================================ HashMap Class ======================================>


class HashMap {
  constructor(initialCapacity=8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i=0; i<string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }


  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Not Found');
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    this._slots[index] = {
      key,
      value,
      deleted: false
    };
    this.length++;
  }


  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i=start; i<start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if (slot === undefined || (slot.key === key && !slot.deleted)) {
        return index;
      }
    }
  }


  _resize(size) {
    console.log('resize was called');
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key Error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }



}
HashMap.MAX_LOAD_RATIO = .8;
HashMap.SIZE_RATIO = 3;


//============================================ Helper Functions ======================================>

const display = (hashmap)  => {
  for (let i=0;i<hashmap._slots.length; i++) {
    console.log(i, ': ',hashmap._slots[i]);
  }
  console.log('Capacity: ',hashmap._capacity);
  console.log('Length: ', hashmap.length);
};



//============================================ Palindrome ======================================>
/* 
Write an algorithm to check whether any permutation of a string is a palindrome. Given the string "acecarr", the algorithm should return true, because the letters in "acecarr" can be rearranged to "racecar", which is a palindrome. In contrast, given the word "north", the algorithm should return false, because there's no way to rearrange those letters to be a palindrome.
*/

// The core test of whether a word is a palindrome is:
// 1: The word reversed is the same as the word forwards
// 2: If this is true, then there is at most one letter which has an odd number of occurences. 
// So we will

// Take string in as a parameter. 
// create a new HashMap
// in a for loop, loop through each character in the string
//    each iteration, check to see if the character has already been stored there. if so, increment it's count. If not, store it.
// initialize a counter variable
// loop through the hash map using the string as an index, each time that an odd number of occurences is encountered, increase the counter. 
// if the counter is greater than 1, return false. If equal to or less than one, return true


const containsKey = (table,key) => {
  try {
    table.get(key);
    return true;
  } catch(e) {
    return false;
  }
};

const checkPalindrome = str => {
  const pdHash = new HashMap();
  for (let i=0;i<str.length; i++) {
    if (containsKey(pdHash,str[i])) {
      let num = pdHash.get(str[i]);
      pdHash.set(str[i],++num);
    } else {
      pdHash.set(str[i], 1);
    }
  }

  const dictionary = {};
  str.split('').forEach(letter => {
    if (!dictionary[letter]) {
      dictionary[letter] = 1;
    } 
  });

  let counter = 0;
  Object.keys(dictionary).forEach(letter => {
    if (pdHash.get(letter) %2 !== 0) {
      counter++;
    } 
  });
  return counter <= 1;
};





//============================================ Anagram Grouping ==============================================>
/*Write an algorithm to group a list of words into anagrams. For example, if the input was ['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race'], the output should be: [['east', 'teas', 'eats'], ['cars', 'arcs'], ['acre', 'race']2].
*/

// take an array of words as a parameter arrOfWords
// create a new array parentArr;
// loop through each word in the array
//    Sort the word alphabetically, and store it in the hash table if it is not already there 
// loop through the hash table's words, and then run a nested loop within this loop
//    in the nested loop, create an array called arrOfAnagrams,  
//    loop through each word in arrOfWords and push it to the arrOfAnagrams
// then push arrOfAnagrams to the parent Arr.
// return parentArr

// const anagram = arrOfWords => {
//   const agHash = new HashMap();
//   let parentArr = [];
//   let counter = 0;
//   arrOfWords.forEach(word => {
//     agHash.set(counter.toString(),word.split('').sort().join(''));
//     counter++;
//   });
//   for (let i=0; i<agHash.length;i++) {
//     let currentHashValue;
//     try {
//       currentHashValue = agHash.get(i.toString());
//     } catch(e) {
//       currentHashValue = null;
//     }
//     let arrOfAnagrams = [];
//     for (let j=0;j<arrOfWords.length;j++) {
//       if (arrOfWords[j].split('').sort().join('') === currentHashValue) {
//         arrOfAnagrams.push(arrOfWords[j]); 
//       }  
//     }
//     parentArr.push(arrOfAnagrams);
//   }

//   console.log('AGHASH: ', agHash);
//   return parentArr;
// };



const anagram = arr => {
  const agHash = new HashMap();

  arr.forEach((word,index) => {
    word = word.split('').sort().join('');
    try {
      agHash.get(word);
      agHash.set(word, index);
    } catch(e) {
      agHash.set(word, index);
    }
  });

  const parentArr = [];
  arr.forEach((word,index) => {
    const sortedWord = word.split('').sort().join('');
    let anagramArr = [];
    if (agHash.get(sortedWord) !== index) {
      return;
    } else {
      arr.forEach(word => {
        if (word.split('').sort().join('') === sortedWord) {
          anagramArr.push(word);
        }
      });
    }
    parentArr.push(anagramArr);
  });
  return parentArr;
};




//============================================ Main Function for Implementation ==============================>

function main() {
  // const myHash = new HashMap();
  // myHash.set('Hobbit','Bilbo');
  // myHash.set('Hobbit','Frodo');
  // myHash.set('Wizard','Gandalf');
  // myHash.set('Human','Aragorn');
  // myHash.set('Elf','Legolas');
  // myHash.set('Maiar','The Necromancer');
  // myHash.set('Maiar','Sauron');
  // myHash.set('RingBearer','Gollum');
  // myHash.set('LadyOfLight','Galadriel');
  // myHash.set('HalfElven','Arwen');
  // myHash.set('End','Treebeard');
  // display(myHash);
  // console.log('----breaker----');
  // console.log(myHash.get('Maiar'));
  // console.log(checkPalindrome('amanaplanacanalpanama'));
  // console.log(anagram(['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race']));
}

