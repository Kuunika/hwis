import { useState } from "react"

const updatePatient = () => {
    const [homeLocation, setHomeLocation] = useState({})
    const [currentLocation, setCurrentLocation] = useState({})
    const [demographics, setDemographics] = useState({})
    const [nextOfKin, setNextOfKin] = useState({})
    const [guardianInformation, setGuardianInformation] = useState({})

    return { setHomeLocation, setCurrentLocation, setDemographics, setNextOfKin, setGuardianInformation }

}