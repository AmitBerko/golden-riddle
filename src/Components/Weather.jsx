import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({setMessage}) => {
    // Defining constants
    const [temperatures, setTemperatures] = useState([])
    const [date, setDate] = useState('2023-01-01')
    const url = 'https://api.open-meteo.com/v1/forecast'

    // Used to round the average temperature so it will be easier to read
    const round = (num) => Math.floor(num * 100) / 100;

    useEffect(() => {
        // Getting the temperature data everytime the date input changes
        async function fetchWeatherData() {
            try {
                const response = await axios.get(url, {
                    params: {
                        latitude: 30,
                        longitude: 35,
                        hourly: 'temperature_2m',
                        start_date: date,
                        end_date: date
                    }
                }) 
                setTemperatures(response.data.hourly.temperature_2m) 
            } catch (error) {
                console.log(error) 
            }
        }
        fetchWeatherData()
    }, [date]) 

    useEffect(() => {
        // Used for automatic updates
        document.getElementsByClassName('submit-button')[0].click()
    }, [temperatures])

    // Defining variables
    const rows = []
    let statusRow = []
    let hourRow = []
    let xCount = 0

    // Looping through the different hourly temperatures array
    temperatures.forEach((temp, index) => {
        // Determine the status of the temperature (whether the plane can take off or not)
        let status = ''
        if (temp > 15 && temp < 30) {
            status = '✅'
        } else {
            status = '❌'
            xCount++
        }
        // Pushing the statuses and hours to end up with an entire row of it
        statusRow.push(<td key={index}>{status}</td>)
        hourRow.push(<td key={index}>{index}:00</td>)

        /*
        In order to make the table symetric, we need to check if index + 1 is divisible by 6
        when it happens, we want to go down to the next row, so we first push the hours row,
        then the statuses row, and then reset them both back to an empty array
        */
        if ((index + 1) % 6 == 0) {
            rows.push(<tr>{hourRow}</tr>)
            rows.push(<tr>{statusRow}</tr>)
            hourRow = []
            statusRow = []
        }
        if (xCount == 24) {
            /*
             If everything is X, we won't be able to take off, so we need
             to write a message about it. I also added the average temperature
            */
            let averageTemp = round((temperatures.reduce((acc, current) => acc + current)) / temperatures.length)
            setMessage(`לא ניתן להמריא באף אחד מן השעות, הטמפרטורה הממוצעת ביום הזה היא ${averageTemp}`) 
        }
    })

    return (
        <div>
            <input 
                class="date-picker"
                type="date"
                value={date}
                onChange={event => setDate(event.target.value)}
            />
            <table className="table">
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}

export default Weather