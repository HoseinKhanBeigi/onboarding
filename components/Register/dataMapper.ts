import { ObjectUtils } from '../../lib/ObjectUtils';

export function dataMapper(data, map?: Record<string, string>) {
  const variablePattern = new RegExp(/\$\{([\[\]<>:=\w\d-\.])+\}/);
  let mappedData: any = data;
  if (map) {
    mappedData = {};
    for (const item in map) {
      if (map.hasOwnProperty(item)) {
        const mapValue = map[item];
        if (variablePattern.test(mapValue)) {
          const matchedData = mapValue.match(/[^\$\{]([^${}])+[^\}]/g);
          if (matchedData) {
            let targetValue = mapValue;
            if (matchedData.length > 1) {
              matchedData.forEach(variablePath => {
                const replacement = ObjectUtils.resolveStringPathInObject(
                  { ...data },
                  variablePath,
                );
                targetValue = targetValue.replace(
                  `\$\{${variablePath}\}`,
                  replacement || '',
                );
              });
            } else {
              targetValue = ObjectUtils.resolveStringPathInObject(
                { ...data },
                matchedData[0],
              );
            }
            if (ObjectUtils.checkIfItsFilled(targetValue)) {
              mappedData = ObjectUtils.insertDataIntoObjectByStringPath(
                mappedData,
                item,
                targetValue,
              );
            }
          } else {
            throw new Error(`there is no path to map data in: ${item}`);
          }
        } else {
          mappedData = ObjectUtils.insertDataIntoObjectByStringPath(
            mappedData,
            item,
            mapValue,
          );
        }
      }
    }
  }
  return { data, mappedData };
}

export default dataMapper;
