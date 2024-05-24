import { createUser, getUsers, searchUser, updateUser } from "@/services/users";
import { useMutation, useQuery } from "@tanstack/react-query";


export const addUser = () => {
    const addData = (data: any) => {

        const roles = data.role.map((r: any) => ({ name: r.id }))
        const mappedData = {
            username: data.userName,
            password: data.password,
            person: {
                gender: "Male",
                age: 47,
                birthdate: "1970-01-01T00:00:00.000+0100",
                birthdateEstimated: false,
                dead: false,
                deathDate: null,
                causeOfDeath: null,
                names: [
                    {
                        givenName: data.firstName,
                        familyName: data.lastName
                    }
                ]
            },
            roles
        };


        return createUser(mappedData).then((response) => response.data);
    };

    return useMutation({
        mutationFn: addData,
    });
};

export const getAllUsers = () => {
    const getall = () =>
        getUsers().then((response) => response.data);

    return useQuery({
        queryKey: ["users"],
        queryFn: () => getall(),
        enabled: true,
    });
};
export const checkUsername = (username: string) => {
    const getall = () =>
        searchUser(username).then((response) => response.data);

    return useQuery({
        queryKey: ["search", username],
        queryFn: () => getall(),
        enabled: false,
    });
};

export const editUser = ()=>{
    const edit=(data: any)=>{
    const updatedUserData = {
        username: data.userName,
        roles: data.role.map((r: { label: any; }) => ({
          name: r.label,
        })),
        password: data.password
      };
   
      return updateUser(data.userId, updatedUserData)
      .then((response) => response.data)
    };

    return useMutation({
        mutationFn: edit,
    });
    
};
