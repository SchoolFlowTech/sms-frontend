export const CREATE_EMPLOYEE_MUTATION = `
  mutation createEmployee($data: CreateEmployeeInput!) {
    createEmployee(data: $data) {
      status
      message
      data {
        firstName
        lastName
        mobileNumber
        address
        joiningDate
        salary
        status
        type
      }
    }
  }
`;

export const EMPLOYEE_QUERY = `
  query Employees {
    employees {
      status
      message
      data {
        id
        firstName
        lastName
        mobileNumber
        address
        joiningDate
        salary
        status
        type
      }
    }
  }
`;

export const GET_EMPLOYEE_BY_ID_QUERY = `
  query Employee($employeeId: ID!) {
    employee(employeeId: $employeeId) {
      status
      message
      data {
        id
        firstName
        lastName
        mobileNumber
        address
        joiningDate
        salary
        status
        type
        teacher {
          id
          qualification
          experience
          gender
          dateOfBirth
        }
      }
    }
  }
`;

export const UPDATE_EMPLOYEE_MUTATION = `
  mutation UpdateEmployee(
    $employeeId: Int!
    $data: UpdateEmployeeInput!
  ) {
    updateEmployee(
      employeeId: $employeeId
      data: $data
  ) {
    status
    message
    data {
      id
      firstName
      lastName
      mobileNumber
      address
      joiningDate
      salary
      status
      type
      teacher {
        qualification
        experience
        gender
        dateOfBirth
      }
    }
  }
}
`;