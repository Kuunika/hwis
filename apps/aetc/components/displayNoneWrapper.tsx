import { ReactNode } from "react"
import { WrapperBox } from "shared-ui/src"

export const DisplayNone = ({ hidden, children }: { hidden: boolean, children: ReactNode }) => {
    return <WrapperBox sx={{ display: hidden ? 'none' : "block" }}>{children}</WrapperBox>
}