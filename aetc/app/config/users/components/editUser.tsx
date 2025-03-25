import { OverlayLoader } from "@/components/backdrop";
import { useNavigation, useParameters } from "@/hooks";
import { editUser } from "@/hooks/users";
import { getUserById } from "@/services/users";
import { useState, useEffect } from "react";
import { EditUserForm } from "./editUserForm";

export const EditUser = () => {
  const { mutate, isPending, isSuccess } = editUser();
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userId = params?.id as string;
    setUserId(userId);
    if (userId) {
      getUserById(userId)
        .then((user) => {
          setInitialValues({
            username: user.data.username,
            role: user.data.user_roles.map((role) => ({
              id: role.role.role,
              label: role.role.role,
            })),
          });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          setIsLoading(false);
        });
    }
  }, [params]);

  useEffect(() => {
    if (isSuccess) {
      navigateTo("/config");
    }
  }, [isSuccess]);

  const handleSubmit = async (values: {
    userName: any;
    firstName: any;
    lastName: any;
    role: any[];
    password: any;
  }) => {
    const updatedValues = {
      ...values,
      userId,
    };

    mutate(updatedValues);
  };

  return (
    <>
      <div>
        <h1>Edit User</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <EditUserForm initialValues={initialValues} onSubmit={handleSubmit} />
        )}
      </div>
      <OverlayLoader open={isPending} />
    </>
  );
};
