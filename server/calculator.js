function roundObj(obj) {
    for (var key in obj) {
        if (typeof (obj[key]) === 'number')
            obj[key] = Math.floor(obj[key] * 100) / 100;
    }
    return obj;
}

function calculate(extraMass) {
    /* 
        This function gets the "extraMass" parameter and returns the
        distance the plane had traveled and the time passed until it took off

        Note: The function also returns a "status" variable which is used to determine
        the message the user will see.
        "success" will tell the user the take-off time and distance.
        "slow" will tell the user how many kilograms the plane should remove.
        "error" will tell the user that the input must be a number
    */
    if (extraMass < 0) 
        return { status: 'error' }

    const enginePower = 100000 // 100,000[N]
    const planeMass = 35000 // 35,000[KG]
    // F = ma --> a = F/m
    const acceleration = enginePower / (planeMass + extraMass)

    // If the acceleration is lower than 140 / 60 it will take the plane more than 60 seconds to take off
    if (acceleration < (140 / 60)) {
        return roundObj({ weightToLose: planeMass + extraMass - enginePower / (140 / 60), status: 'slow' })
    }
    // The plane takes off at 140kmh, this will give us the time it takes to get to this speed
    const takeOffTime = 140 / acceleration

    // x = v_0 * t + 0.5 * a * t^2, since v_0 is 0 we can ignore it UPDATE COMMENT!!!
    const takeOffDistance = 0.5 * acceleration * Math.pow(takeOffTime, 2)

    // Rounded these values to 2 decimal places to make them easier to read.
    return roundObj({ takeOffDistance: takeOffDistance, takeOffTime, status: 'success' })
    
}

module.exports = calculate
