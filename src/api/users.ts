import { mockUsers } from "../mocks/users";
import type { User } from "../types/user";
import type { UserFormValues } from "../schemas/user-schema";

export async function getUsers(): Promise<User[]> {
  return Promise.resolve([...mockUsers]);
}

export async function createUser(
  data: UserFormValues,
): Promise<User> {
  const newUser: User = {
    id: Date.now(),
    ...data,
  };

  mockUsers.push(newUser);

  return Promise.resolve(newUser);
}

export async function updateUser(
  id: number,
  data: UserFormValues,
): Promise<User> {
  const index = mockUsers.findIndex((user) => user.id === id);

  if (index === -1) {
    throw new Error("User not found");
  }

  mockUsers[index] = {
    ...mockUsers[index],
    ...data,
  };

  return Promise.resolve(mockUsers[index]);
}