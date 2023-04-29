
//since modeule.exports can be expressed as set od objects we can specify particular function /output via module.exports.{object}
// instead of defining function we can create anonymous func and pass it to module.exports.{name_of_function} shortly
// exports.{name_of_file} via node js shorts

exports.getDate = function (){
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        // year: "numeric"
    }
    return today.toLocaleDateString('en-US', options);  
}

exports.getDay = function (){
    const today = new Date();
    const options = {
        weekday: "long",
    }
    return today.toLocaleDateString('en-US', options);
}