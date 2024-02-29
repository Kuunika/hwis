import { MainButton, MainTypography, WrapperBox } from "shared-ui/src"
import { FaRegCheckSquare, FaRegSquare, FaSearch } from "react-icons/fa";

export const MergeDuplicates = () => {

    const results = [
        {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            district: "Ntcheu",
            homeTA: "Chikulamayembe",
            village: "vingula",
            gender: "M",
            dateofbirth: "08-01-1994"
        },
        {
            id: "2",
            firstName: "Jane",
            lastName: "Doe",
            district: "Blantyre",
            homeTA: "Chikulamayembe",
            village: "vingula",
            gender: "M",
            dateofbirth: "08-01-1994"
        },
        {
            id: "3",
            firstName: "Anold",
            lastName: "Banda",
            district: "Blantyre",
            homeTA: "Chikulamayembe",
            village: "vingula",
            gender: "M",
            dateofbirth: "08-01-1994"
        }
    ]



    return <WrapperBox>
        {results.map((r) => <ResultRow person={r} key={r.id} />)}
    </WrapperBox>
}

const ResultRow = ({ person }: { person: any }) => {
    return <WrapperBox sx={{ display: "flex", p: "1ch", borderRadius: "2px", my: "1ch", cursor: "pointer", justifyContent: "space-between", "&:hover": { backgroundColor: "#DDE0E5" } }}>
        <WrapperBox><MainTypography variant="h4"><FaRegSquare /></MainTypography></WrapperBox>
        <WrapperBox sx={{ ml: "1ch", width: "70%" }}>
            <LabelValue label="Name" value={`${person.firstName} ${person.lastName}(${person.gender}) ${person.dateofbirth} `} />
            <LabelValue label="Home District" value={person.district} />
            <LabelValue label="Home TA" value={person.homeTA} />
            <LabelValue label="Home Village" value={person.village} />
        </WrapperBox>
        <WrapperBox>
            <MainButton variant="secondary" title={"reassign Id"} onClick={() => { }} />
        </WrapperBox>
    </WrapperBox>
}

const LabelValue = ({ label, value }: { label: string, value: string }) => {
    return <WrapperBox display={"flex"}>
        <MainTypography variant="caption">{label}:</MainTypography> <MainTypography fontWeight={"600"} variant="caption">{value}</MainTypography>
    </WrapperBox>
}