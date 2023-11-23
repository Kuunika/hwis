"use client"
import CurrentObsteric from './anc/registration/currentObsteric/components/CurrentObsteric'
import MedicalHistory from './anc/registration/medicalHistory/components/MedicalHistory'

export default function Home() {
  return (
    <main>
      {/* <MedicalHistory onSubmit={function (values: any): void {
        throw new Error('Function not implemented.')
      } }/> */}
      <CurrentObsteric onSubmit={function (values: any): void {
        throw new Error('Function not implemented.')
      } }/>
    </main>
  )
}
