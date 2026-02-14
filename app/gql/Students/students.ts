// graphql/mutations/createStudent.js

export const CREATE_STUDENT_MUTATION = `
  mutation CreateStudent(
    $firstName: String!
    $lastName: String!
    $gender: String!
    $dateOfBirth: String!
    $mobileNumber: String!
    $address: String!
    $className: String!
    $section: String!
    $rollNumber: String!
    $admissionDate: String!
    $status: String!
  ) {
    createStudent(
      firstName: $firstName
      lastName: $lastName
      gender: $gender
      dateOfBirth: $dateOfBirth
      mobileNumber: $mobileNumber
      address: $address
      className: $className
      section: $section
      rollNumber: $rollNumber
      admissionDate: $admissionDate
      status: $status
    ) {
      status
      message
      data {
        studentId
        firstName
        lastName
        gender
        dateOfBirth
        mobileNumber
        address
        className
        section
        rollNumber
        admissionDate
        status
      }
    }
  }
`;
