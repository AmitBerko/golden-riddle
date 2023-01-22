import { React, useState, useMemo, useRef, useEffect } from 'react'
import axios from 'axios'
import '../styles.scss'

const CalculatorPage = () => {
    // Initializing the states and refs
    const [extraWeight, setExtraWeight] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState({})
    const inputElement = useRef()
    const labelElement = useRef()

    useEffect(() => {
        inputElement.current.addEventListener('input', handleInput);
    }, []);

    function handleInput(event) {
        // This function is for the css
        if (event.target.value !== '') {
            labelElement.current.classList.add('not-empty');
            inputElement.current.classList.add('not-empty');
        }
        else {
            event.target.value = '' // Using this to get rid of the leading 0
            labelElement.current.classList.remove('not-empty');
            inputElement.current.classList.remove('not-empty');
        }
    }

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
        if (isLoading || inputElement.current.value == '' || inputElement.current.value < 0) return
        setIsLoading(true)
        try {
            const response = await axios.get(`/calculate/${extraWeight}`)
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
        <h1 className="title">מחשבון המראה</h1>
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        className="weight-input"
                        required=""
                        autoComplete="off"
                        value={extraWeight}
                        type="number"
                        ref={inputElement}
                        onChange={event => setExtraWeight(Number(event.target.value))}
                    />
                    <label className="weight-label" htmlFor="weight-input" ref={labelElement}>מסת המטען</label>
                </div>
                <button className="submit-button" type="submit">חשב</button>
            </form>

            {
                result &&
                <p className="result-message">
                    {message} {/* Displaying the message on the calculator page */}
                </p>
            }
        </div>
        </>
    )
}

export default CalculatorPage