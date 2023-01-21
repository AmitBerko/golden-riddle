import { React, useState, useMemo, useRef } from 'react'
import axios from 'axios'

const CalculatorPage = () => {
    // Initializing the states and refs
    const [extraWeight, setExtraWeight] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState({})
    const inputElement = useRef()

    function getMessage() {
        /*
            The function returns the message to be displayed 
            on the calculator page depending on the status
        */
        switch (result.status) {
            case 'success':
                return `מרחק ההמראה הוא ${result.takeOffDistance} מטרים, וזמן ההמראה הוא ${result.takeOffTime} שניות`
            case 'slow':
                return `עם המשקל הנוכחי לא תספיקו להמריא בפחות מ60 שניות, תצטרכו להיפטר מ${result.weightToLose} קילוגרמים`
            case 'error':
                return 'שגיאה, וודאו שהקלט שהוכנס הינו מספר אי שלילי'
        }
    }

    // Using the useMemo hook so the getMessage function won't run after every change in the textbox
    let message = useMemo(() => getMessage(), [result])

    async function handleSubmit(event) {
        /*
            This function takes an event as a parameter and handles the 
            submit button click by getting the result from the API

            Note: I used the isLoading variable to prevent cases where the
            API will get a request before the last one was done
        */
        event.preventDefault()
        if (isLoading || inputElement.current.value == '') return
        setIsLoading(true)
        try {
            const response = await axios.get(`/calculate/${extraWeight}` )
            setResult(response.data)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <button className="submit-button" type="submit">חשב</button>
            <input
                id="weight-input"
                value={(extraWeight)}
                type="number"
                ref={inputElement}
                onChange={event => setExtraWeight(Number(event.target.value))}
            />
            <label className="weight-label" for="weight-input">משקל מטען</label>
        </form>

        {
        result &&
        <p>
            {message} {/* Displaying the message on the calculator page */}
        </p>
        }
    </>
    )
}

export default CalculatorPage