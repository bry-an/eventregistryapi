map = (value, fn) => {
    let x = []
    for (let i = 0; i < value.length; i++) {
        x.push(fn(value[i]))
    }
    return x
}

addOne = num => {
    return num + 1
}

const numbers = [2, 6, 3, 6]

// console.log(map(numbers, addOne))
// console.log(numbers)

filter = (value, fn) => {
    let x = []
    for (let i = 0; i < value.length; i++) {
        if(fn(value[i]))
        x.push(value[i])
    }
    return filter(x, fn)
}

equalsSixOrThree = num => {
    return num === 6 || num === 3
}
equalsSix = num => {
    return num === 6
}

console.log(numbers)


//Object.assign:
