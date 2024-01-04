const removeFromArray = (array: string[], id:string) => {
  if (array.indexOf(id) !== -1) { array.splice(array.indexOf(id), 1); }
  return [ ...array ];
} 

export default removeFromArray;