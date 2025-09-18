// This Service used in controllers to validate URLs before processing them.
function isValid(url) {

    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }   
}   
export default isValid;
