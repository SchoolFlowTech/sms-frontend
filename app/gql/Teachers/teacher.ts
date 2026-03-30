// graphql/mutations/createTeacher.js

export const CREATE_TEACHER_MUTATION = `
  mutation createTeacher($data: CreateTeacherInput!) {
    createTeacher(data: $data) {
      status
      message
      data {
        id
        employee {
          firstName
          lastName
          mobileNumber
          address
          joiningDate
          salary
          status
        }
        qualification
        experience
        gender
        dateOfBirth
      }
    }
  }
`;

export const GET_TEACHER_QUERY = `
  query GetTeacher($teacherId: Int!) {
    teacher(teacherId: $teacherId) {
      status
      message
      data {
        id
        employee {
          firstName
          lastName
          mobileNumber
          address
          joiningDate
          salary
          status
        }
        qualification
        experience
        gender
        dateOfBirth
      }
    }
  }
`;



export const UPDATE_TEACHER_MUTATION = `
  mutation UpdateTeacher(
  $teacherId: Int!
  $data: UpdateTeacherInput!
) {
  updateTeacher(
    teacherId: $teacherId
    data: $data
  ) {
    status
    message
    data {
      qualification
      experience
      gender
      dateOfBirth
    }
  }
}
`;
