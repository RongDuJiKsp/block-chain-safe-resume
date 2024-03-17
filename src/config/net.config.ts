
export const ipfsConfig = {
    protocol: "http",
    host: "localhost",
    port: "5001",
}
export const fileConfig={
    supposedType:"application/json;charset=utf8"
}
export const serverConfig={
    backendUrl:"http://localhost:5000"
}
export const fileSuffixConfig=new Map([
    ["application/pdf","pdf"],
    ["text/key","key"],
    ["text/plain","txt"]
]);