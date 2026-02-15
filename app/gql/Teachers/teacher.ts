// graphql/mutations/createTeacher.js

export const CREATE_TEACHER_MUTATION = `
  mutation createTeacher(
    $userId: Int
    $firstName: String!
    $lastName: String!
    $gender: String!
    $dateOfBirth: String!
    $mobileNumber: String!
    $address: String!
    $qualification: String!
    $experience: Int!
    $joiningDate: String!
    $salary: Float!
    $status: String!
  ) {
    createTeacher(
      userId: $userId
      firstName: $firstName
      lastName: $lastName
      gender: $gender
      dateOfBirth: $dateOfBirth
      mobileNumber: $mobileNumber
      address: $address
      qualification: $qualification
      experience: $experience
      joiningDate: $joiningDate
      salary: $salary
      status: $status
    ) {
      status
      message
      data {
        teacherId
        firstName
        lastName
        gender
        dateOfBirth
        mobileNumber
        address
        qualification
        experience
        joiningDate
        salary
        status
      }
    }
  }
`;
