"use client";
import { useEffect, useState } from 'react';
import { getUserById, updateUser } from '../../../../services/users';
import { useNavigation, useParameters } from '@/hooks';
import { EditUserForm } from '../../components/editUserForm';

const EditUserPage = () => {
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

  const handleSubmit = async (values: { userName: any; firstName: any; lastName: any; role: any[]; password: any; }) => {
        console.log('submitting');
      const updatedUserData = {
        username: values.userName,
        roles: values.role.map((r) => ({
          name: r.label,
        })),
        password: values.password
      };
      console.log(updatedUserData);
      updateUser(userId, updatedUserData)
      .then(() => {
          navigateTo('/config');
      })
      .catch((error) => {
          console.error('Error updating user:', error);
      });

  };

  return (
    <div>
      <h1>Edit User</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <EditUserForm initialValues={initialValues} onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default EditUserPage;
