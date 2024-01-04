const duplicateObject = (object : any) => JSON.parse(JSON.stringify(object));

export default duplicateObject;