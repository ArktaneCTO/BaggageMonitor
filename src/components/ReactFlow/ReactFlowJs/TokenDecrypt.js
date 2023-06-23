import CryptoJS from "crypto-js";

// token decryption
// const token = localStorage.getItem("token");
const token = "U2FsdGVkX1+iDwHWp5XW/EDipXBIajkrSL0iVT2jh3FoXzQh3PwcBc2V0t7gBhxxvc1+r+CyvGYzlOvdZcKfBK6/4ImrxN1DcleA+Sx7q6Jw6TziKEOXb1oOVz2ieuZ+/bTOzMquFBYyaFpCP9UQ6KD0+OryA5B4sjNvqHqNOKc+jnHs18MaAgxasM9OzfNY32b/fA/K6ks4ozY2jW3zObImE/j7Mp6PnsveLJUONq3mcO5BFXeGXlt872/9KI40rwmkhL8RGy1bY6KIBbC2bUVQJcUK3kvFGZpXDvwEwUQ="
const bytes = CryptoJS.AES.decrypt(token, "my-token");
const decryptedDataString = bytes.toString(CryptoJS.enc.Utf8);
const decryptedData = JSON.parse(decryptedDataString);
const sendToken = decryptedData.token;
const sendRole=decryptedData.role;
// this decrypts the token and divides into two parts jwt token and role of the user
export {sendToken,sendRole}