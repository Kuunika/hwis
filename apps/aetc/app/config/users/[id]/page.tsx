"use client";
import { useEffect, useState } from 'react';
import { getUserById } from '../../../../services/users';
import { useNavigation, useParameters } from '@/hooks';
import { EditUserForm } from '../../components/editUserForm';
import { editUser } from '@/hooks/users';
import { OverlayLoader } from '@/components/backdrop';

const EditUserPage = () => {

  const { mutate, isPending, isSuccess } = editUser();
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const userId = params.id.toString();
    setUserId(userId);

    if (userId) {
      getUserById(userId).then((user) => {
        setInitialValues({
          userName: user.data.username,
          firstName: user.data.person.names[0].given_name,
          lastName: user.data.person.names[0].family_name,
          role: user.data.user_roles.map(role => ({
            id: role.role.uuid,
            label: role.role.role
          }))
        });
        setIsLoading(false);
      }).catch((error) => {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      });
    }
  }, [params]);

  useEffect(() => {

    if (isSuccess) {
        navigateTo("/config");
    }

}, [isSuccess, isPending, isLoading])

  const handleSubmit = async (values: { userName: any; firstName: any; lastName: any; role: any[]; password: any; }) => {
  
    const updatedValues = {
        ...values,
        userId,
      };

      mutate(updatedValues);

  };

  return (
    <>
      <h1>Edit User</h1>

        <EditUserForm initialValues={initialValues} onSubmit={handleSubmit} />
    <OverlayLoader open={isPending} />
    </>
  );
};

export default EditUserPage;
