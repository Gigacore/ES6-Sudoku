const matrix = [
  [5,3,null,null,7,null,null,null,null],
  [6,null,null,1,9,5,null,null,null],
  [1,9,8,null,null,null,null,6,null],
  [8,null,null,null,6,null,null,null,3],
  [4,null,null,8,null,3,null,null,1],
  [7,null,null,null,2,null,null,null,6],
  [null,6,null,null,null,null,2,8,null],
  [null,null,null,4,1,9,null,null,5],
  [null,null,null,null,8,null,null,7,9]
];

const matrixLength = 3;

const generateCellData = (index, matrixLength) => {
  return {
    index,
    reminder: index % matrixLength
  }
}

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
    const { startIndex, endIndex } = getIndices(generateCellData(index, matrixLength));
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
}

const _getCurrentIndex = (e) => {
  const index = parseInt(e.getAttribute("data-index"), 10);
  const array = parseInt(e.getAttribute("data-array"), 10);
  let value = '';
  
  setTimeout(() => {
    value = parseInt(e.value, 10);
    getGrid(index, array, value, e);
  });
}

const wrapper = document.getElementById("wrapper");

const renderPuzzle = () => {
  matrix.forEach((arr, i) => {
    arr.forEach((row, j) => {
      wrapper.innerHTML += 
      `<div data-array=${i} class="${row !== null ? 'disabled' : ''}">
        <input data-array=${i} data-index=${j} maxlength="1" type="tel" pattern="[0-9]*" value="${row !== null ? row : ''}" onKeyUp="_getCurrentIndex(this)"/>
      </div>`;
    });
  });
}

const checkForDuplicates = (arr, num, e) => {
  e.classList.remove("duplicate");

  for(let i = 0; i < arr.length; i++) {
    if(arr[i] === num) {
      e.classList.add("duplicate");
      break;
    }
  }
}

renderPuzzle();