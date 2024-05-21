"use client"
import { useEffect, useState } from 'react';
import { UserForm } from '../../components/userForm';
import { getUserById } from '../../../../services/users';
import { useParameters } from '@/hooks';

const EditUserPage = () => {
  const { params } = useParameters()
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      getUserById(userId.toString()).then((user) => {
        setInitialValues({
            userName: user.data.username,
            firstName: user.data.person.names[0].given_name,
            lastName: user.data.person.names[0].family_name,
            role: user.data.user_roles.map(role => role.role)
          });
        setIsLoading(false);
      }).catch((error) => {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      });
    }
  }, [params.id]);

  const handleSubmit = (values: any) => {

    //updateUser(params.id[0], values).then(() => {
      // Handle successful update
// Redirect to users list page
   // }).catch((error) => {
     // console.error('Error updating user:', error);
      // Handle error
    //});
  };

  return (
    <div>
      <h1>Edit User</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <UserForm initialValues={initialValues} onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default EditUserPage;
