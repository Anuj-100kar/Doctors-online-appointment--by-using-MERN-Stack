import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const backendUrl = "http://localhost:4000";
    const currency='$'
    const calculateage = (dob) => {
        const today = new Date()
        const birthdate = new Date(dob)

        let age = today.getFullYear() - birthdate.getFullYear()
        return age
    }


    const months = ["", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const value = {
        calculateage,
        slotDateFormat,
        currency,backendUrl
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider