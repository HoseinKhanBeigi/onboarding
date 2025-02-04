export const getElementHeight = (entityRef, data) => {
  const threshold = 724;

  const mergedHeight = [...entityRef.children[0].children]
    .map((item, i) => {
      const total = [...item.children]
        .map((child, k) => {
          return child.clientHeight;
        })
        .filter(number => number !== 0);

      return total;
    })
    .flat(Infinity);

  const dataEntites = data.map(e => {
    return e.pages[0].entities;
  });

  const dataEntitesMerged = dataEntites
    .map(e => {
      let arr = [];
      arr = [...e];
      arr.push({ '': '' });
      return arr;
    })
    .flat(Infinity);

  let pageHeight = 0;
  let pageContent = [];
  const parentT = [];
  let result = [];
  let j = 0;

  for (let i = 0; i < mergedHeight.length; i++) {
    if (pageHeight < threshold && i === mergedHeight.length - 1) {
      pageContent = dataEntitesMerged.slice(j, i);
      parentT.push({ pages: [{ entities: pageContent }] });
      break;
    }
    if (pageHeight < threshold) {
      pageHeight += mergedHeight[i];
    } else {
      pageContent = dataEntitesMerged.slice(j, i);
      j = i;
      pageHeight = 0;
      parentT.push({ pages: [{ entities: pageContent }] });
    }
  }
  result = parentT.filter(child => child.pages[0].entities.length !== 0);

  return result;
};
