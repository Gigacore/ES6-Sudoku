const matrix = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [1,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];

const matrixLength = 3;

const generateCellData = (index, matrixLength) => {
  return {
    index,
    reminder: index % matrixLength
  };
};

const getGrid = (index, array, value, e) => {
  const getIndices = (data, indices={
    startIndex: null,
    endIndex: null
  }) => {
    const { index, reminder } = data;
    
    switch(reminder) {
      case 0: 
        return {
          ...indices,
          startIndex: index,
          endIndex: +index + 2
          }
        break;
      case 1:
        return {
          ...indices,
          startIndex: +index - 1,
          endIndex: +index + 1
          }
      case 2:
          return {
          ...indices,
          startIndex: +index - 2,
          endIndex: index
        }
    }	
  
    return indices;
  }

  const gatherRowItems = () => {
    const { startIndex, endIndex } = getIndices(generateCellData(array, matrixLength));
    let tempArr = new Array;
  
    for(let i = startIndex; i <= endIndex; i++) {
      tempArr.push(matrix[i]);
    } 

    return tempArr;
  }

  const gatherColumnItems = () => matrix.map(arr => arr[index]);

  const gatherBlockItems = () => {
    const verticalIndices = getIndices(generateCellData(index, matrixLength));
    let gridItems = new Array;
    
    gatherRowItems().forEach((arr) => {
      for(let i = verticalIndices.startIndex; i <= verticalIndices.endIndex; i++) {
        gridItems.push(arr[i])
      }
    });

    return gridItems;
  }

  const mergeAndFilterArrays = () => [...new Set([...matrix[array], ...gatherColumnItems(), ...gatherBlockItems()])];
  checkForDuplicates(mergeAndFilterArrays(), value, e);

  const isDuplicate = checkForDuplicates(mergeAndFilterArrays(), value, e);
  
  // replace with immutablity 
  matrix[array][index] = value;

  const isFinished = matrix.reduce((acc, cur) => acc.concat(cur), []).filter(value => value !== 0).length;

  if(isFinished >= 80) {
    if(isFinished === 81 && !isDuplicate) {
      alert("Puzzle solved!");
      const inputElm = document.querySelectorAll('#wrapper div');
      
      for(let i = 0; i < inputElm.length; i++) {
        inputElm[i].classList.add("disabled");
      }
    }
  }
}

const _getCurrentIndex = (e) => {
  const index = parseInt(e.getAttribute("data-index"), 10);
  const array = parseInt(e.getAttribute("data-array"), 10);
  let value = '';
  
  value = parseInt(e.value, 10);
  getGrid(index, array, value, e);
};

const renderPuzzle = () => {
  const wrapper = document.getElementById("wrapper");

  matrix.forEach((arr, i) => {
    arr.forEach((row, j) => {
      wrapper.innerHTML += 
      `<div data-array=${i} class="${row !== 0 ? 'disabled' : ''}">
        <input data-array=${i} data-index=${j} maxlength="1" type="tel" pattern="[1-9]*" value="${row !== 0 ? row : ''}" onKeyUp="_getCurrentIndex(this)"/>
      </div>`;
    });
  });
};

const checkForDuplicates = (arr, num, e) => {
  e.classList.remove("duplicate");

  let isDuplicate = false;

  for(let i = 0; i < arr.length; i++) {
    if(arr[i] === num) {
      e.classList.add("duplicate");
      isDuplicate = true;
      break;
    };
  };

  return isDuplicate;
};

renderPuzzle();