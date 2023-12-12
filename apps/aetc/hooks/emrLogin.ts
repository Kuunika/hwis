import {
  ApiCore,
  PatientService,
  IdentifierTypeService,
} from "mahis-api-client";

export const emrLogin = async () => {
  ApiCore.setHost("http://192.168.33.43:3000/");
  ApiCore.logout();
  // Condition runs a health check with provided host
  // Check if loggin session is present before accessing API resources
  if (!ApiCore.isLoggedIn()) {
    // Login with username and password respectively
    const authentication = await ApiCore.login("admin", "test");
    // Check status of the authentication before accessing api resource
    if (authentication.ok) {
      //   const `patientService`s = await ApiCore.getJson("patients");
      const patients = await PatientService.all();
      console.log(await IdentifierTypeService.all());
      patients.patients?.forEach((patient) => {
        console.log(patient.identifiers[0].identifier);
      });

      if (patients.ok) console.log(patients.data);
    }
  } else {
    // alert("Invalid host");
  }
};
