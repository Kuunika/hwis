import { MainButton, MainTypography, WrapperBox } from "shared-ui/src"
import { FaRegCheckSquare, FaRegSquare, FaSearch } from "react-icons/fa";
import { useState } from "react";

const results = [
    {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        district: "Ntcheu",
        homeTA: "Chikulamayembe",
        village: "vingula",
        gender: "M",
        dateofbirth: "08-01-1994",
        selected: true
    },
    {
        id: "2",
        firstName: "Jane",
        lastName: "Doe",
        district: "Blantyre",
        homeTA: "Chikulamayembe",
        village: "vingula",
        gender: "M",
        dateofbirth: "08-01-1994",
        selected: false
    },
    {
        id: "3",
        firstName: "Anold",
        lastName: "Banda",
        district: "Blantyre",
        homeTA: "Chikulamayembe",
        village: "vingula",
        gender: "M",
        dateofbirth: "08-01-1994",
        selected: false
    }
]
export const MergeDuplicates = () => {
    const [patientResult, setPatientResult] = useState<Array<any>>(results);

    const handleSelect = (id: string) => {
        const patients = [...patientResult];
        const index = patients.findIndex(p => p.id == id);
        patients[index].selected = !patients[index].selected;
        setPatientResult(patients)
    }


    return <WrapperBox>
        {patientResult.map((r) => <ResultRow onClick={handleSelect} person={r} key={r.id} />)}
    </WrapperBox>
}

const ResultRow = ({ person, onClick }: { person: any, onClick: (id: string) => void }) => {
    return (<WrapperBox onClick={() => onClick(person.id)} sx={{ display: "flex", p: "1ch", borderRadius: "2px", my: "1ch", cursor: "pointer", justifyContent: "space-between", backgroundColor: person.selected ? "#DDE0E5" : "", "&:hover": { backgroundColor: "#DDE0E5" } }}>
        <WrapperBox><MainTypography variant="h6">{person.selected ? <FaRegCheckSquare /> : <FaRegSquare />}</MainTypography></WrapperBox>
        <WrapperBox sx={{ ml: "1ch", width: "70%" }}>
            <LabelValue label="Name" value={`${person.firstName} ${person.lastName}(${person.gender}) ${person.dateofbirth} `} />
            <LabelValue label="Home District" value={person.district} />
            <LabelValue label="Home TA" value={person.homeTA} />
            <LabelValue label="Home Village" value={person.village} />
        </WrapperBox>
        <WrapperBox>
            <MainButton variant="secondary" title={"reassign Id"} onClick={() => { }} />
        </WrapperBox>
    </WrapperBox>)
}

const LabelValue = ({ label, value }: { label: string, value: string }) => {
    return <WrapperBox display={"flex"}>
        <MainTypography variant="caption">{label}:</MainTypography> <MainTypography fontWeight={"600"} variant="caption">{value}</MainTypography>
    </WrapperBox>
}